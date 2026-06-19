package br.com.fiap.orcapro.service;

import br.com.fiap.orcapro.dto.*;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Conta;
import br.com.fiap.orcapro.model.Transacao;
import br.com.fiap.orcapro.repository.CategoriaRepository;
import br.com.fiap.orcapro.repository.ContaRepository;
import br.com.fiap.orcapro.repository.TransacaoRepository;
import br.com.fiap.orcapro.specification.TransacaoSpecification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final ContaRepository contaRepository;
    private final CategoriaRepository categoriaRepository;
    private final JwtService jwtService;

    public TransacaoService(TransacaoRepository transacaoRepository, ContaRepository contaRepository, CategoriaRepository categoriaRepository, JwtService jwtService) {

        this.transacaoRepository = transacaoRepository;
        this.contaRepository = contaRepository;
        this.categoriaRepository = categoriaRepository;
        this.jwtService = jwtService;
    }

    // ======================================================
    // MÉTODOS AUXILIARES
    // ======================================================

    private TransacaoResponseDTO toDTO(Transacao transacao) {

        TransacaoResponseDTO dto = new TransacaoResponseDTO();

        dto.setId(transacao.getId());
        dto.setDescricao(transacao.getDescricao());
        dto.setOrigemDestino(transacao.getOrigemDestino());
        dto.setValor(transacao.getValor());
        dto.setDataTransacao(transacao.getDataTransacao());

        dto.setConta(new ContaResumoDTO(transacao.getConta()));

        dto.setCategoria(new CategoriaResumoDTO(transacao.getCategoria()));

        return dto;
    }

    private void aplicarSaldo(Conta conta, BigDecimal valor, TipoCategoria tipoCategoria) {

        if (tipoCategoria == TipoCategoria.ENTRADA) {

            conta.setSaldo(conta.getSaldo().add(valor));

        } else {

            if (conta.getSaldo().compareTo(valor) < 0) {

                throw new RuntimeException("Saldo insuficiente na conta " + conta.getInstituicao());
            }

            conta.setSaldo(conta.getSaldo().subtract(valor));
        }

        contaRepository.save(conta);
    }

    private void reverterSaldo(Conta conta, BigDecimal valor, TipoCategoria tipoCategoria) {

        if (tipoCategoria == TipoCategoria.ENTRADA) {

            conta.setSaldo(conta.getSaldo().subtract(valor));

        } else {

            conta.setSaldo(conta.getSaldo().add(valor));
        }

        contaRepository.save(conta);
    }

    private void validarTransacao(Transacao transacao) {

        if (transacao.getValor() == null || transacao.getValor().compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException("O valor da transação deve ser maior que zero");
        }

        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {

            throw new RuntimeException("Categoria obrigatória");
        }

        if (transacao.getConta() == null || transacao.getConta().getId() == null) {

            throw new RuntimeException("Conta obrigatória");
        }

        if (transacao.getDataTransacao() == null) {

            throw new RuntimeException("Data da transação obrigatória");
        }
    }

    // ======================================================
    // CRUD
    // ======================================================

    @Transactional
    public TransacaoResponseDTO salvar(Transacao transacao, String token) {

        Long idUsuario = jwtService.extrairId(token);

        validarTransacao(transacao);

        Conta conta = contaRepository.findById(transacao.getConta().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!conta.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        Categoria categoria = categoriaRepository.findById(transacao.getCategoria().getId()).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        if (!categoria.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        transacao.setConta(conta);
        transacao.setCategoria(categoria);

        Transacao transacaoSalva = transacaoRepository.save(transacao);

        aplicarSaldo(conta, transacao.getValor(), categoria.getTipo());

        return toDTO(transacaoSalva);
    }

    @Transactional(readOnly = true)
    public TransacaoResponseDTO buscarPorId(Long id, String token) {

        Long idUsuario = jwtService.extrairId(token);

        Transacao transacao = transacaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Transação não encontrada com id: " + id));

        if (!transacao.getConta().getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        return toDTO(transacao);
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponseDTO> buscarTodos(String token) {

        Long idUsuario = jwtService.extrairId(token);

        // ordena por DataTransacao E desempata por Id
        return transacaoRepository.findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(idUsuario).stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponseDTO> buscarComFiltro(
            TransacaoFiltroDTO filtro,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        return transacaoRepository.findAll(
                        TransacaoSpecification.filtrar(
                                idUsuario,
                                filtro.getCategoriaId(),
                                filtro.getTipo(),
                                filtro.getContaId(),
                                filtro.getDataInicio(),
                                filtro.getDataFim()
                        )
                )
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void excluir(Long id, String token) {

        Long idUsuario = jwtService.extrairId(token);

        Transacao transacao = transacaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Transação não encontrada com id: " + id));

        if (!transacao.getConta().getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        reverterSaldo(transacao.getConta(), transacao.getValor(), transacao.getCategoria().getTipo());

        transacaoRepository.deleteById(id);
    }

    @Transactional
    public TransacaoResponseDTO atualizar(Long id, Transacao transacao, String token) {

        Long idUsuario = jwtService.extrairId(token);

        validarTransacao(transacao);

        Transacao transacaoAtual = transacaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Transação não encontrada com id: " + id));

        if (!transacaoAtual.getConta().getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        Conta contaAtual = transacaoAtual.getConta();

        Conta novaConta = contaRepository.findById(transacao.getConta().getId()).orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!novaConta.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        Categoria categoria = categoriaRepository.findById(transacao.getCategoria().getId()).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        if (!categoria.getUsuario().getId().equals(idUsuario)) {

            throw new RuntimeException("Acesso negado");
        }

        reverterSaldo(contaAtual, transacaoAtual.getValor(), transacaoAtual.getCategoria().getTipo());

        transacaoAtual.setConta(novaConta);
        transacaoAtual.setCategoria(categoria);

        transacaoAtual.setOrigemDestino(transacao.getOrigemDestino());

        transacaoAtual.setDescricao(transacao.getDescricao());

        transacaoAtual.setValor(transacao.getValor());

        transacaoAtual.setDataTransacao(transacao.getDataTransacao());

        Transacao transacaoAtualizada = transacaoRepository.save(transacaoAtual);

        aplicarSaldo(novaConta, transacao.getValor(), categoria.getTipo());

        return toDTO(transacaoAtualizada);
    }

    // ======================================================
    // RELATÓRIOS
    // ======================================================

    @Transactional(readOnly = true)
    public ResumoTransacaoDTO buscarResumo(
            TransacaoFiltroDTO filtro,
            String token
    ) {

        Long idUsuario = jwtService.extrairId(token);

        List<Transacao> transacoes = transacaoRepository.findAll(
                TransacaoSpecification.filtrar(
                        idUsuario,
                        filtro.getCategoriaId(),
                        filtro.getTipo(),
                        filtro.getContaId(),
                        filtro.getDataInicio(),
                        filtro.getDataFim()
                )
        );

        BigDecimal receitas = BigDecimal.ZERO;
        BigDecimal despesas = BigDecimal.ZERO;

        for (Transacao transacao : transacoes) {
            if (transacao.getCategoria().getTipo() == TipoCategoria.ENTRADA) {
                receitas = receitas.add(transacao.getValor());
            } else {
                despesas = despesas.add(transacao.getValor());
            }
        }

        return new ResumoTransacaoDTO(
                receitas,
                despesas,
                receitas.subtract(despesas),
                (long) transacoes.size()
        );
    }

    @Transactional(readOnly = true)
    public List<ResumoCategoriaDTO> obterResumoPorCategoria(String token, LocalDate dataInicio, LocalDate dataFim) {
        Long idUsuario = jwtService.extrairId(token);
        return transacaoRepository.buscarResumoPorCategoriaNoPeriodo(idUsuario, dataInicio, dataFim);
    }

    @Transactional(readOnly = true)
    public List<ResumoMesDTO> obterResumoAnual(
            Integer ano,
            Long contaId,
            Long categoriaId,
            TipoCategoria tipo,
            String token
    ) {
        Long idUsuario = jwtService.extrairId(token);

        List<ResumoMesSqlDTO> resultadosSql = transacaoRepository.buscarResumoAnualPivot(
                idUsuario, ano, contaId, categoriaId, tipo
        );

        List<ResumoMesDTO> resumoList = new ArrayList<>();

        // Monta os 12 meses do ano para o Front-end não bugar com meses vazios
        for (int mes = 1; mes <= 12; mes++) {
            final int mesAtual = mes;

            ResumoMesSqlDTO dadosDoMes = resultadosSql.stream()
                    .filter(r -> r.mes().equals(mesAtual))
                    .findFirst()
                    .orElse(new ResumoMesSqlDTO(mesAtual, BigDecimal.ZERO, BigDecimal.ZERO));

            String mesFormatado = String.format("%02d/%d", mes, ano);
            BigDecimal saldoDoMes = dadosDoMes.receitas().subtract(dadosDoMes.despesas());

            resumoList.add(new ResumoMesDTO(
                    mesFormatado,
                    dadosDoMes.receitas(),
                    dadosDoMes.despesas(),
                    saldoDoMes
            ));
        }

        return resumoList;
    }
}