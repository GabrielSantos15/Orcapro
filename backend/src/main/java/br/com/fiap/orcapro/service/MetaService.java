package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.dto.MetaResponseDTO;
import br.com.fiap.orcapro.dto.ProgressoMetaRequestDTO;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Conta;
import br.com.fiap.orcapro.model.Meta;
import br.com.fiap.orcapro.model.Transacao;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.ContaRepository;
import br.com.fiap.orcapro.repository.MetaRepository;
import br.com.fiap.orcapro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class MetaService {

    private final MetaRepository metaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContaRepository contaRepository;
    private final CategoriaRepository categoriaRepository;
    private final TransacaoService transacaoService;
    private final JwtService jwtService;

    public MetaService(MetaRepository metaRepository, UsuarioRepository usuarioRepository, ContaRepository contaRepository, CategoriaRepository categoriaRepository, TransacaoService transacaoService, JwtService jwtService) {
        this.metaRepository = metaRepository;
        this.usuarioRepository = usuarioRepository;
        this.contaRepository = contaRepository;
        this.categoriaRepository = categoriaRepository;
        this.transacaoService = transacaoService;
        this.jwtService = jwtService;
    }

    // ======================================================
    //  DTO
    // ======================================================

    private MetaResponseDTO toDTO(Meta meta) {
        return new MetaResponseDTO(meta.getId(), meta.getNome(), meta.getDescricao(), meta.getValorAlvo(), meta.getValorAtual(), meta.getDataLimite(), meta.getConcluida());
    }

    // ======================================================
    // AUXILIARES DE CATEGORIA
    // ======================================================

    private Categoria buscarOuCriarCategoriaMeta(Usuario usuario) {
        return categoriaRepository.findByNomeAndTipoAndUsuario("Metas", TipoCategoria.SAIDA, usuario).orElseGet(() -> {
            Categoria categoria = new Categoria();
            categoria.setNome("Metas");
            categoria.setTipo(TipoCategoria.SAIDA);
            categoria.setUsuario(usuario);
            return categoriaRepository.save(categoria);
        });
    }

    // NOVO: Categoria de ENTRADA para quando o dinheiro volta para a conta
    private Categoria buscarOuCriarCategoriaResgateMeta(Usuario usuario) {
        return categoriaRepository.findByNomeAndTipoAndUsuario("Resgate de Metas", TipoCategoria.ENTRADA, usuario).orElseGet(() -> {
            Categoria categoria = new Categoria();
            categoria.setNome("Resgate de Metas");
            categoria.setTipo(TipoCategoria.ENTRADA);
            categoria.setUsuario(usuario);
            return categoriaRepository.save(categoria);
        });
    }

    // ======================================================
    // CRUD
    // ======================================================

    @Transactional
    public MetaResponseDTO salvar(Meta meta, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        meta.setUsuario(usuario);
        meta.setValorAtual(meta.getValorAtual() != null ? meta.getValorAtual() : BigDecimal.ZERO);
        meta.setConcluida(false);

        Meta metaSalva = metaRepository.save(meta);
        return toDTO(metaSalva);
    }

    @Transactional(readOnly = true)
    public MetaResponseDTO buscarPorId(Long id, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Meta meta = metaRepository.findById(id).orElseThrow(() -> new RuntimeException("Meta não encontrada com id: " + id));

        if (!meta.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        return toDTO(meta);
    }

    @Transactional(readOnly = true)
    public List<MetaResponseDTO> buscarTodos(String token) {
        Long idUsuario = jwtService.extrairId(token);

        return metaRepository.findByUsuarioId(idUsuario).stream().map(this::toDTO).toList();
    }

    @Transactional
    public void excluir(Long id, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Meta meta = metaRepository.findById(id).orElseThrow(() -> new RuntimeException("Meta não encontrada com id: " + id));

        if (!meta.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        metaRepository.delete(meta);
    }

    @Transactional
    public MetaResponseDTO atualizar(Long id, Meta meta, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Meta metaAtual = metaRepository.findById(id).orElseThrow(() -> new RuntimeException("Meta não encontrada com id: " + id));

        if (!metaAtual.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        metaAtual.setNome(meta.getNome());
        metaAtual.setDescricao(meta.getDescricao());
        metaAtual.setValorAlvo(meta.getValorAlvo());

        if (meta.getValorAtual() != null) {
            metaAtual.setValorAtual(meta.getValorAtual());

            if (metaAtual.getValorAtual().compareTo(metaAtual.getValorAlvo()) >= 0) {
                metaAtual.setConcluida(true);
            } else {
                metaAtual.setConcluida(false);
            }
        }

        metaAtual.setDataLimite(meta.getDataLimite());

        Meta metaAtualizada = metaRepository.save(metaAtual);
        return toDTO(metaAtualizada);
    }

    // ======================================================
    // OPERAÇÕES FINANCEIRAS DA META
    // ======================================================

    @Transactional
    public MetaResponseDTO atualizarProgresso(Long id, ProgressoMetaRequestDTO dto, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Meta meta = metaRepository.findById(id).orElseThrow(() -> new RuntimeException("Meta não encontrada com id: " + id));

        if (!meta.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        if (dto.valor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("O valor guardado deve ser maior que zero");
        }

        Conta conta = contaRepository.findById(dto.contaId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!conta.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado na conta informada");
        }

        meta.setValorAtual(meta.getValorAtual().add(dto.valor()));

        if (meta.getValorAtual().compareTo(meta.getValorAlvo()) >= 0) {
            meta.setConcluida(true);
        }

        Meta metaAtualizada = metaRepository.save(meta);

        Categoria categoria = buscarOuCriarCategoriaMeta(meta.getUsuario());

        Transacao transacao = new Transacao(conta, categoria, "Reserva para meta: " + meta.getNome(), "Dinheiro guardado para meta", dto.valor(), LocalDate.now());

        transacaoService.salvar(transacao, token);

        return toDTO(metaAtualizada);
    }

    // NOVO: Método exclusivo para resgate
    @Transactional
    public MetaResponseDTO resgatarProgresso(Long id, ProgressoMetaRequestDTO dto, String token) {
        Long idUsuario = jwtService.extrairId(token);

        Meta meta = metaRepository.findById(id).orElseThrow(() -> new RuntimeException("Meta não encontrada com id: " + id));

        if (!meta.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado");
        }

        if (dto.valor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("O valor resgatado deve ser maior que zero");
        }

        if (meta.getValorAtual().compareTo(dto.valor()) < 0) {
            throw new RuntimeException("Saldo insuficiente na meta para este resgate");
        }

        Conta conta = contaRepository.findById(dto.contaId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!conta.getUsuario().getId().equals(idUsuario)) {
            throw new RuntimeException("Acesso negado na conta informada");
        }

        meta.setValorAtual(meta.getValorAtual().subtract(dto.valor()));

        if (meta.getValorAtual().compareTo(meta.getValorAlvo()) < 0) {
            meta.setConcluida(false);
        }

        Meta metaAtualizada = metaRepository.save(meta);

        Categoria categoria = buscarOuCriarCategoriaResgateMeta(meta.getUsuario());

        Transacao transacao = new Transacao(conta, categoria, "Resgate da meta: " + meta.getNome(), "Dinheiro resgatado da meta", dto.valor(), LocalDate.now());

        transacaoService.salvar(transacao, token);

        return toDTO(metaAtualizada);
    }
}