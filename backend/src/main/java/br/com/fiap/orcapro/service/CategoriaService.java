package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.TransacaoRepository;
import br.com.fiap.orcapro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TransacaoRepository transacaoRepository;
    private final JwtService jwtService;

    public CategoriaService(CategoriaRepository categoriaRepository, UsuarioRepository usuarioRepository, TransacaoRepository transacaoRepository, JwtService jwtService) {

        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.transacaoRepository = transacaoRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public Categoria salvar(Categoria categoria, String token) {

        Long idUsuario = jwtService.extrairId(token);

        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        categoria.setUsuario(usuario);

        categoria.setAtiva(true);

        return categoriaRepository.save(categoria);
    }

    @Transactional(readOnly = true)
    public Categoria buscarPorId(Long id, String token) {

        Long idUsuario = jwtService.extrairId(token);

        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + id));

        if (!categoria.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        return categoria;
    }

    @Transactional(readOnly = true)
    public List<Categoria> buscarTodos(String token) {

        Long idUsuario = jwtService.extrairId(token);

        return categoriaRepository.findByUsuarioId(idUsuario);
    }

    @Transactional
    public void excluir(Long id, String token) {

        Long idUsuario = jwtService.extrairId(token);

        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + id));

        if (!categoria.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        boolean possuiTransacoes = !transacaoRepository.findByCategoriaId(id).isEmpty();

        // Se possuir transações, apenas desativa
        if (possuiTransacoes) {

            categoria.setAtiva(false);

            categoriaRepository.save(categoria);

            return;
        }

        categoriaRepository.delete(categoria);
    }

    @Transactional
    public Categoria atualizar(Long id, Categoria categoria, String token) {

        Long idUsuario = jwtService.extrairId(token);

        Categoria categoriaAtual = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada com id: " + id));

        if (!categoriaAtual.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        categoriaAtual.setNome(categoria.getNome());

        categoriaAtual.setTipo(categoria.getTipo());

        if (categoria.getAtiva() != null) {

            categoriaAtual.setAtiva(categoria.getAtiva());
        }

        return categoriaRepository.save(categoriaAtual);
    }
}