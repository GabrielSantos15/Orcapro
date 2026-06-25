package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.dto.UsuarioResponseDTO;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Conta;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.ContaRepository;
import br.com.fiap.orcapro.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CategoriaRepository categoriaRepository;
    private final ContaRepository contaRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService, CategoriaRepository categoriaRepository, ContaRepository contaRepository) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.categoriaRepository = categoriaRepository;
        this.contaRepository = contaRepository;
    }

    // ======================================================
    // DTO
    // ======================================================

    private UsuarioResponseDTO toDTO(Usuario usuario) {
        return new UsuarioResponseDTO(usuario);
    }

    // ======================================================
    // PÚBLICOS
    // ======================================================

    @Transactional
    public UsuarioResponseDTO salvar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está sendo utilizado.");
        }
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        criarCategoriasPadrao(usuarioSalvo);
        criarContaPadrao(usuarioSalvo);

        return toDTO(usuarioSalvo);
    }

    private void criarCategoriasPadrao(Usuario usuario) {

        List<Categoria> categorias = List.of(

                new Categoria(usuario, "Salário", TipoCategoria.ENTRADA, true),

                new Categoria(usuario, "Freelance", TipoCategoria.ENTRADA, true),

                new Categoria(usuario, "Investimentos", TipoCategoria.ENTRADA, true),

                new Categoria(usuario, "Outros", TipoCategoria.ENTRADA, true),

                new Categoria(usuario, "Alimentação", TipoCategoria.SAIDA, true),

                new Categoria(usuario, "Transporte", TipoCategoria.SAIDA, true),

                new Categoria(usuario, "Moradia", TipoCategoria.SAIDA, true),

                new Categoria(usuario, "Saúde", TipoCategoria.SAIDA, true),

                new Categoria(usuario, "Lazer", TipoCategoria.SAIDA, true),

                new Categoria(usuario, "Outros", TipoCategoria.SAIDA, true));

        categoriaRepository.saveAll(categorias);
    }

    private void criarContaPadrao(Usuario usuario) {

        Conta carteira = new Conta(usuario, "Carteira", "CORRENTE", BigDecimal.ZERO, true);

        contaRepository.save(carteira);
    }

    @Transactional(readOnly = true)
    public Map<String, String> login(String email, String senha) {

        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {

            throw new RuntimeException("E-mail ou senha inválidos");
        }

        String token = jwtService.gerarToken(usuario.getId(), usuario.getEmail());

        return Map.of("token", token, "nome", usuario.getNome());
    }

    // ======================================================
    // USUÁRIO LOGADO
    // ======================================================

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPerfil(String token) {

        Long idUsuario = jwtService.extrairId(token);

        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return toDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarPerfil(Usuario usuario, String token) {
        Long idUsuario = jwtService.extrairId(token);
        Usuario usuarioAtual = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (usuario.getEmail() != null && !usuario.getEmail().isBlank()) {
            if (!usuario.getEmail().equals(usuarioAtual.getEmail()) &&
                    usuarioRepository.existsByEmail(usuario.getEmail())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está sendo utilizado por outro usuário.");
            }
            usuarioAtual.setEmail(usuario.getEmail());
        }
        if (usuario.getNome() != null && !usuario.getNome().isBlank()) {
            usuarioAtual.setNome(usuario.getNome());
        }

        if (usuario.getEmail() != null && !usuario.getEmail().isBlank()) {
            usuarioAtual.setEmail(usuario.getEmail());
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioAtual);
        return toDTO(usuarioAtualizado);
    }

    @Transactional
    public void excluirPerfil(String token) {

        Long idUsuario = jwtService.extrairId(token);

        usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuarioRepository.deleteById(idUsuario);
    }

    // ======================================================
    // SEGURANÇA
    // ======================================================

    @Transactional
    public void alterarSenha(String senhaAtual, String novaSenha, String token) {
        Long idUsuario = jwtService.extrairId(token);
        Usuario usuarioAtual = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(senhaAtual, usuarioAtual.getSenha())) {
            throw new RuntimeException("A senha atual informada está incorreta.");
        }

        if (novaSenha == null || novaSenha.isBlank()) {
            throw new RuntimeException("A nova senha não pode ser vazia.");
        }

        usuarioAtual.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuarioAtual);
    }

    // ======================================================
    // ADMINISTRATIVOS
    // ======================================================

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarPorId(Long id) {

        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));

        return toDTO(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> buscarTodos() {

        return usuarioRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional
    public void excluir(Long id) {

        usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));

        usuarioRepository.deleteById(id);
    }

    @Transactional
    public UsuarioResponseDTO atualizar(Long id, Usuario usuario) {

        Usuario usuarioAtual = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));

        usuarioAtual.setNome(usuario.getNome());
        usuarioAtual.setEmail(usuario.getEmail());

        if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {

            usuarioAtual.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioAtual);

        return toDTO(usuarioAtualizado);
    }
}