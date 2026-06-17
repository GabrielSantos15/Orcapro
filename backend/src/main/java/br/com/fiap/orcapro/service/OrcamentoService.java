package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.dto.OrcamentoRequestDTO;
import br.com.fiap.orcapro.dto.OrcamentoResponseDTO;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Orcamento;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.OrcamentoRepository;
import br.com.fiap.orcapro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final JwtService jwtService;

    public OrcamentoService(OrcamentoRepository orcamentoRepository,
                            UsuarioRepository usuarioRepository,
                            CategoriaRepository categoriaRepository,
                            JwtService jwtService) {
        this.orcamentoRepository = orcamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.jwtService = jwtService;
    }

    // ======================================================
    // CRUD
    // ======================================================

    @Transactional
    public OrcamentoResponseDTO criar(OrcamentoRequestDTO dto, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        if (!categoria.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado: Esta categoria não pertence ao usuário logado.");
        }

        if (orcamentoRepository.existsByUsuarioIdAndCategoriaId(idUsuario, categoria.getId())) {
            throw new RuntimeException("Você já possui um orçamento definido para esta categoria.");
        }

        Orcamento orcamento = new Orcamento(usuario, categoria, dto.limite());
        Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);

        return new OrcamentoResponseDTO(orcamentoSalvo);
    }

    @Transactional(readOnly = true)
    public OrcamentoResponseDTO buscarPorId(Long id, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado com id: " + id));

        if (!orcamento.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        return new OrcamentoResponseDTO(orcamento);
    }

    @Transactional(readOnly = true)
    public List<OrcamentoResponseDTO> listarTodos(String token) {
        Long idUsuario = jwtService.extrairId(token);

        return orcamentoRepository.findByUsuarioId(idUsuario)
                .stream()
                .map(OrcamentoResponseDTO::new)
                .toList();
    }

    @Transactional
    public OrcamentoResponseDTO atualizar(Long id, OrcamentoRequestDTO dto, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Orcamento orcamentoAtual = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado com id: " + id));

        if (!orcamentoAtual.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        // Se o usuário estiver tentando trocar a categoria do orçamento
        if (!orcamentoAtual.getCategoria().getId().equals(dto.categoriaId())) {
            Categoria novaCategoria = categoriaRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Nova categoria não encontrada."));

            if (!novaCategoria.getUsuario().getId().equals(idUsuario)) {
                throw new RuntimeException("Acesso negado: A nova categoria não pertence ao usuário logado.");
            }

            // Verifica se já não existe outro orçamento para essa nova categoria
            if (orcamentoRepository.existsByUsuarioIdAndCategoriaId(idUsuario, novaCategoria.getId())) {
                throw new RuntimeException("Você já possui um orçamento definido para esta nova categoria.");
            }

            orcamentoAtual.setCategoria(novaCategoria);
        }

        orcamentoAtual.setLimite(dto.limite());

        Orcamento orcamentoAtualizado = orcamentoRepository.save(orcamentoAtual);
        return new OrcamentoResponseDTO(orcamentoAtualizado);
    }

    @Transactional
    public void excluir(Long id, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado com id: " + id));

        if (!orcamento.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        orcamentoRepository.delete(orcamento);
    }
}