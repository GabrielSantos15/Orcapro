package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.dto.ContaResponseDTO;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Conta;
import br.com.fiap.orcapro.model.Transacao;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.ContaRepository;
import br.com.fiap.orcapro.repository.InvestimentoRepository;
import br.com.fiap.orcapro.repository.TransacaoRepository;
import br.com.fiap.orcapro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ContaService {

    private final ContaRepository contaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final TransacaoRepository transacaoRepository;
    private final InvestimentoRepository investimentoRepository;
    private final JwtService jwtService;
    private final TransacaoService transacaoService;

    public ContaService(
            ContaRepository contaRepository,
            UsuarioRepository usuarioRepository,
            CategoriaRepository categoriaRepository,
            TransacaoRepository transacaoRepository,
            InvestimentoRepository investimentoRepository,
            JwtService jwtService,
            TransacaoService transacaoService
    ) {

        this.contaRepository = contaRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.transacaoRepository = transacaoRepository;
        this.investimentoRepository = investimentoRepository;
        this.jwtService = jwtService;
        this.transacaoService = transacaoService;
    }

    // ======================================================
    // DTO
    // ======================================================

    private ContaResponseDTO toDTO(Conta conta) {
        return new ContaResponseDTO(conta);
    }

    // ======================================================
    // VALIDAÇÕES
    // ======================================================

    private void validarConta(Conta conta) {

        List<String> tiposValidos = List.of(
                "CORRENTE",
                "POUPANCA",
                "INVESTIMENTO"
        );

        if (conta.getTipo() == null ||
                !tiposValidos.contains(conta.getTipo())) {

            throw new RuntimeException(
                    "Tipo de conta inválido. " +
                            "Use: CORRENTE, POUPANCA ou INVESTIMENTO"
            );
        }
    }

    // ======================================================
    // CRUD
    // ======================================================

    @Transactional
    public ContaResponseDTO salvar(
            Conta conta,
            String token
    ) {

        validarConta(conta);

        Long idUsuario =
                jwtService.extrairId(token);

        Usuario usuario =
                usuarioRepository.findById(idUsuario)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuário não encontrado"
                                )
                        );

        // Guarda o saldo inicial informado
        BigDecimal saldoInicial =
                conta.getSaldo();

        // Conta nasce zerada
        conta.setSaldo(BigDecimal.ZERO);

        conta.setUsuario(usuario);

        Conta contaSalva =
                contaRepository.save(conta);

        // Cria transação de saldo inicial
        if (saldoInicial != null &&
                saldoInicial.compareTo(BigDecimal.ZERO) > 0) {

            criarTransacaoSaldoInicial(
                    contaSalva,
                    usuario,
                    saldoInicial,
                    token
            );
        }

        return toDTO(contaSalva);
    }

    @Transactional
    private void criarTransacaoSaldoInicial(
            Conta conta,
            Usuario usuario,
            BigDecimal saldoInicial,
            String token
    ) {

        Categoria categoria = categoriaRepository
                .findByNomeAndTipoAndUsuario(
                        "Outros",
                        TipoCategoria.ENTRADA,
                        usuario
                )
                .orElseGet(() -> {

                    Categoria novaCategoria =
                            new Categoria();

                    novaCategoria.setNome("Outros");

                    novaCategoria.setTipo(
                            TipoCategoria.ENTRADA
                    );

                    novaCategoria.setUsuario(
                            usuario
                    );

                    return categoriaRepository
                            .save(novaCategoria);
                });

        Transacao transacao =
                new Transacao(
                        conta,
                        categoria,
                        "Saldo inicial",
                        "Valor inicial da conta "
                                + conta.getInstituicao(),
                        saldoInicial,
                        LocalDate.now()
                );

        transacaoService.salvar(
                transacao,
                token
        );
    }

    @Transactional(readOnly = true)
    public ContaResponseDTO buscarPorId(
            Long id,
            String token
    ) {

        Long idUsuario =
                jwtService.extrairId(token);

        Conta conta =
                contaRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conta não encontrada com id: "
                                                + id
                                )
                        );

        if (!conta.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        return toDTO(conta);
    }

    @Transactional(readOnly = true)
    public List<ContaResponseDTO> buscarTodos(
            String token
    ) {

        Long idUsuario =
                jwtService.extrairId(token);

        return contaRepository
                .findByUsuarioId(idUsuario)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void excluir(
            Long id,
            String token
    ) {

        Long idUsuario =
                jwtService.extrairId(token);

        Conta conta =
                contaRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conta não encontrada com id: "
                                                + id
                                )
                        );

        if (!conta.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        boolean possuiTransacoes =
                transacaoRepository.existsByContaId(id);

        boolean possuiInvestimentos =
                investimentoRepository.existsByContaId(id);

        boolean possuiVinculos =
                possuiTransacoes || possuiInvestimentos;

        // Se possuir vínculos, apenas desativa
        if (possuiVinculos) {

            conta.setAtiva(false);

            contaRepository.save(conta);

            return;
        }

        contaRepository.delete(conta);
    }

    @Transactional
    public ContaResponseDTO atualizar(
            Long id,
            Conta conta,
            String token
    ) {

        validarConta(conta);

        Long idUsuario =
                jwtService.extrairId(token);

        Conta contaAtual =
                contaRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conta não encontrada com id: "
                                                + id
                                )
                        );

        if (!contaAtual.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        contaAtual.setInstituicao(
                conta.getInstituicao()
        );

        contaAtual.setTipo(
                conta.getTipo()
        );

        if (conta.getAtiva() != null) {

            contaAtual.setAtiva(
                    conta.getAtiva()
            );
        }

        Conta contaAtualizada =
                contaRepository.save(contaAtual);

        return toDTO(contaAtualizada);
    }
}