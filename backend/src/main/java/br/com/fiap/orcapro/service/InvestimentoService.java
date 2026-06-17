package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.dto.AporteRequestDTO;
import br.com.fiap.orcapro.dto.AtualizarSaldoRequestDTO;
import br.com.fiap.orcapro.dto.ContaResumoDTO;
import br.com.fiap.orcapro.dto.InvestimentoResponseDTO;
import br.com.fiap.orcapro.dto.ResgateRequestDTO;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Conta;
import br.com.fiap.orcapro.model.Investimento;
import br.com.fiap.orcapro.model.Transacao;
import br.com.fiap.orcapro.model.Usuario;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.ContaRepository;
import br.com.fiap.orcapro.repository.InvestimentoRepository;
import br.com.fiap.orcapro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class InvestimentoService {

    private final InvestimentoRepository investimentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContaRepository contaRepository;
    private final CategoriaRepository categoriaRepository;
    private final JwtService jwtService;
    private final TransacaoService transacaoService;

    public InvestimentoService(
            InvestimentoRepository investimentoRepository,
            UsuarioRepository usuarioRepository,
            ContaRepository contaRepository,
            CategoriaRepository categoriaRepository,
            JwtService jwtService,
            TransacaoService transacaoService
    ) {
        this.investimentoRepository = investimentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.contaRepository = contaRepository;
        this.categoriaRepository = categoriaRepository;
        this.jwtService = jwtService;
        this.transacaoService = transacaoService;
    }

    // ======================================================
    // DTO
    // ======================================================

    private InvestimentoResponseDTO toDTO(Investimento investimento) {
        return new InvestimentoResponseDTO(
                investimento.getId(),
                investimento.getAtivo(),
                investimento.getTipo(),
                investimento.getValorInvestido(),
                investimento.getPercentual(),
                investimento.getIndicador(),
                investimento.getDataAplicacao(),
                investimento.getAtivoStatus(),
                new ContaResumoDTO(investimento.getConta())
        );
    }

    // ======================================================
    // AUXILIAR CATEGORIA
    // ======================================================

    private Categoria buscarOuCriarCategoriaInvestimento(
            Usuario usuario,
            TipoCategoria tipo
    ) {

        return categoriaRepository
                .findByNomeAndTipoAndUsuario(
                        "Investimentos",
                        tipo,
                        usuario
                )
                .orElseGet(() -> {

                    Categoria categoria = new Categoria();

                    categoria.setNome("Investimentos");
                    categoria.setTipo(tipo);
                    categoria.setUsuario(usuario);

                    return categoriaRepository.save(categoria);
                });
    }

    // ======================================================
    // CRUD BÁSICO
    // ======================================================

    @Transactional
    public InvestimentoResponseDTO salvar(
            Investimento investimento,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        Usuario usuario = usuarioRepository
                .findById(idUsuario)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuário não encontrado"
                        )
                );

        Conta conta = contaRepository
                .findById(
                        investimento.getConta().getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Conta não encontrada"
                        )
                );

        if (!conta.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        investimento.setUsuario(usuario);
        investimento.setConta(conta);
        investimento.setAtivoStatus(true);

        Investimento investimentoSalvo =
                investimentoRepository.save(investimento);

        Categoria categoria =
                buscarOuCriarCategoriaInvestimento(
                        usuario,
                        TipoCategoria.SAIDA
                );

        Transacao transacao = new Transacao(
                conta,
                categoria,
                "Aplicação: " + investimento.getAtivo(),
                "Aplicação em investimento",
                investimento.getValorInvestido(),
                LocalDate.now()
        );

        transacaoService.salvar(transacao, token);

        return toDTO(investimentoSalvo);
    }

    @Transactional(readOnly = true)
    public InvestimentoResponseDTO buscarPorId(
            Long id,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        Investimento investimento =
                investimentoRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investimento não encontrado com id: "
                                                + id
                                )
                        );

        if (!investimento.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        return toDTO(investimento);
    }

    @Transactional(readOnly = true)
    public List<InvestimentoResponseDTO> buscarTodos(
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        return investimentoRepository
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

        Long idUsuario = jwtService.extrairId(token);

        Investimento investimento =
                investimentoRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investimento não encontrado com id: "
                                                + id
                                )
                        );

        if (!investimento.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        investimentoRepository.delete(investimento);
    }

    @Transactional
    public InvestimentoResponseDTO atualizar(
            Long id,
            Investimento investimento,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        Investimento investimentoAtual =
                investimentoRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investimento não encontrado com id: "
                                                + id
                                )
                        );

        if (!investimentoAtual.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        Conta conta = contaRepository
                .findById(
                        investimento.getConta().getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Conta não encontrada"
                        )
                );

        if (!conta.getUsuario()
                .getId()
                .equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        investimentoAtual.setConta(conta);
        investimentoAtual.setAtivo(investimento.getAtivo());
        investimentoAtual.setTipo(investimento.getTipo());


        investimentoAtual.setPercentual(
                investimento.getPercentual()
        );

        investimentoAtual.setIndicador(
                investimento.getIndicador()
        );

        investimentoAtual.setDataAplicacao(
                investimento.getDataAplicacao()
        );

        Investimento investimentoAtualizado =
                investimentoRepository.save(
                        investimentoAtual
                );

        return toDTO(investimentoAtualizado);
    }

    // ======================================================
    // OPERAÇÕES FINANCEIRAS
    // ======================================================

    @Transactional
    public InvestimentoResponseDTO resgatar(
            Long id,
            ResgateRequestDTO resgateDTO,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        Investimento investimento =
                investimentoRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investimento não encontrado com id: "
                                                + id
                                )
                        );

        Usuario usuario =
                investimento.getConta().getUsuario();

        if (!usuario.getId().equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        if (resgateDTO.valorResgatado()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Valor resgatado não pode ser negativo"
            );
        }

        if (resgateDTO.saldoRemanescente()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Saldo remanescente não pode ser negativo"
            );
        }

        // Atualiza o saldo para o que sobrou
        investimento.setValorInvestido(
                resgateDTO.saldoRemanescente()
        );

        // Se zerou, inativa o investimento para aparecer cinza no frontend
        if (resgateDTO.saldoRemanescente()
                .compareTo(BigDecimal.ZERO) == 0) {

            investimento.setAtivoStatus(false);
        }

        Investimento investimentoAtualizado =
                investimentoRepository.save(investimento);

        if (resgateDTO.valorResgatado()
                .compareTo(BigDecimal.ZERO) > 0) {

            Categoria categoria =
                    buscarOuCriarCategoriaInvestimento(
                            usuario,
                            TipoCategoria.ENTRADA
                    );

            Transacao transacao = new Transacao(
                    investimento.getConta(),
                    categoria,
                    "Resgate: " + investimento.getAtivo(),
                    "Resgate de investimento",
                    resgateDTO.valorResgatado(),
                    LocalDate.now()
            );

            transacaoService.salvar(
                    transacao,
                    token
            );
        }

        return toDTO(investimentoAtualizado);
    }

    @Transactional
    public InvestimentoResponseDTO aportar(
            Long id,
            AporteRequestDTO aporteDTO,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        Investimento investimento =
                investimentoRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investimento não encontrado com id: "
                                                + id
                                )
                        );

        Usuario usuario =
                investimento.getConta().getUsuario();

        if (!usuario.getId().equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        if (aporteDTO.valorAporte()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "O valor do aporte deve ser maior que zero"
            );
        }

        BigDecimal novoSaldo =
                investimento.getValorInvestido()
                        .add(aporteDTO.valorAporte());

        investimento.setValorInvestido(novoSaldo);

        // Reativa o investimento
        investimento.setAtivoStatus(true);

        Investimento investimentoAtualizado =
                investimentoRepository.save(investimento);

        Categoria categoria =
                buscarOuCriarCategoriaInvestimento(
                        usuario,
                        TipoCategoria.SAIDA
                );

        Transacao transacao = new Transacao(
                investimento.getConta(),
                categoria,
                "Aporte: " + investimento.getAtivo(),
                "Novo aporte em investimento",
                aporteDTO.valorAporte(),
                LocalDate.now()
        );

        transacaoService.salvar(
                transacao,
                token
        );

        return toDTO(investimentoAtualizado);
    }

    @Transactional
    public InvestimentoResponseDTO atualizarSaldo(
            Long id,
            AtualizarSaldoRequestDTO dto,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        Investimento investimento =
                investimentoRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investimento não encontrado com id: "
                                                + id
                                )
                        );

        if (!investimento.getConta().getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException(
                    "Acesso negado"
            );
        }

        if (dto.novoSaldo().compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "O saldo não pode ser negativo"
            );
        }

        investimento.setValorInvestido(
                dto.novoSaldo()
        );

        // Se o usuário atualizar o saldo para ZERO, o fica inativo
        if (dto.novoSaldo().compareTo(BigDecimal.ZERO) == 0) {
            investimento.setAtivoStatus(false);
        } else {
            investimento.setAtivoStatus(true);
        }

        Investimento investimentoAtualizado =
                investimentoRepository.save(investimento);

        return toDTO(investimentoAtualizado);
    }
}