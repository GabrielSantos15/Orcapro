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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

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

    // verificar permissões (DRY)
    private void validarPermissao(Long idDonoEntidade, Long idUsuarioLogado, String nomeEntidade) {
        if (!idDonoEntidade.equals(idUsuarioLogado)) {
            // Lança 403 Forbidden automaticamente pro Front-end
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para acessar esta " + nomeEntidade);
        }
    }

    // Trava de Segurança para não estourar a memória (Máx 90 dias)
    private void aplicarTravaDeData(TransacaoFiltroDTO filtro) {
        if (filtro.getDataInicio() != null && filtro.getDataFim() != null) {
            long dias = ChronoUnit.DAYS.between(filtro.getDataInicio(), filtro.getDataFim());
            if (dias > 90) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O período de filtro não pode ser superior a 90 dias.");
            }
        } else {
            //Se o front não mandar data, assume o mês atual
            LocalDate hoje = LocalDate.now();
            filtro.setDataInicio(hoje.withDayOfMonth(1));
            filtro.setDataFim(hoje.withDayOfMonth(hoje.lengthOfMonth()));
        }
    }

    private void aplicarSaldo(Conta conta, BigDecimal valor, TipoCategoria tipoCategoria) {
        if (tipoCategoria == TipoCategoria.ENTRADA) {
            conta.setSaldo(conta.getSaldo().add(valor));
        } else {
            if (conta.getSaldo().compareTo(valor) < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Saldo insuficiente na conta " + conta.getInstituicao());
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor da transação deve ser maior que zero");
        }
        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria obrigatória");
        }
        if (transacao.getConta() == null || transacao.getConta().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Conta obrigatória");
        }
        if (transacao.getDataTransacao() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data da transação obrigatória");
        }
    }

    // ======================================================
    // CRUD
    // ======================================================

    @Transactional
    public TransacaoResponseDTO salvar(Transacao transacao, String token) {
        Long idUsuario = jwtService.extrairId(token);
        validarTransacao(transacao);

        Conta conta = contaRepository.findById(transacao.getConta().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
        validarPermissao(conta.getUsuario().getId(), idUsuario, "Conta");

        Categoria categoria = categoriaRepository.findById(transacao.getCategoria().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        validarPermissao(categoria.getUsuario().getId(), idUsuario, "Categoria");

        transacao.setConta(conta);
        transacao.setCategoria(categoria);
        Transacao transacaoSalva = transacaoRepository.save(transacao);

        aplicarSaldo(conta, transacao.getValor(), categoria.getTipo());

        return toDTO(transacaoSalva);
    }

    @Transactional(readOnly = true)
    public TransacaoResponseDTO buscarPorId(Long id, String token) {
        Long idUsuario = jwtService.extrairId(token);
        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));

        validarPermissao(transacao.getConta().getUsuario().getId(), idUsuario, "Transação");
        return toDTO(transacao);
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponseDTO> buscarTodos(String token) {
        Long idUsuario = jwtService.extrairId(token);
        return transacaoRepository.findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(idUsuario)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponseDTO> buscarComFiltro(TransacaoFiltroDTO filtro, String token) {
        Long idUsuario = jwtService.extrairId(token);
        aplicarTravaDeData(filtro); // Segurança ativada!

        return transacaoRepository.findAll(
                TransacaoSpecification.filtrar(
                        idUsuario, filtro.getCategoriaId(), filtro.getTipo(),
                        filtro.getContaId(), filtro.getDataInicio(), filtro.getDataFim()
                )
        ).stream().map(this::toDTO).toList();
    }

    @Transactional
    public void excluir(Long id, String token) {
        Long idUsuario = jwtService.extrairId(token);
        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));

        validarPermissao(transacao.getConta().getUsuario().getId(), idUsuario, "Transação");

        reverterSaldo(transacao.getConta(), transacao.getValor(), transacao.getCategoria().getTipo());
        transacaoRepository.deleteById(id);
    }

    @Transactional
    public TransacaoResponseDTO atualizar(Long id, Transacao transacao, String token) {
        Long idUsuario = jwtService.extrairId(token);
        validarTransacao(transacao);

        Transacao transacaoAtual = transacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
        validarPermissao(transacaoAtual.getConta().getUsuario().getId(), idUsuario, "Transação");

        Conta novaConta = contaRepository.findById(transacao.getConta().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
        validarPermissao(novaConta.getUsuario().getId(), idUsuario, "Conta");

        Categoria categoria = categoriaRepository.findById(transacao.getCategoria().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        validarPermissao(categoria.getUsuario().getId(), idUsuario, "Categoria");

        // Reverte na conta antiga e aplica na nova
        reverterSaldo(transacaoAtual.getConta(), transacaoAtual.getValor(), transacaoAtual.getCategoria().getTipo());

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
    public ResumoTransacaoDTO buscarResumo(TransacaoFiltroDTO filtro, String token) {
        Long idUsuario = jwtService.extrairId(token);
        aplicarTravaDeData(filtro);

        return transacaoRepository.buscarResumoAgrupado(
                idUsuario,
                filtro.getDataInicio(),
                filtro.getDataFim()
        );
    }

    @Transactional(readOnly = true)
    public List<ResumoCategoriaDTO> obterResumoPorCategoria(String token, LocalDate dataInicio, LocalDate dataFim) {
        Long idUsuario = jwtService.extrairId(token);
        return transacaoRepository.buscarResumoPorCategoriaNoPeriodo(idUsuario, dataInicio, dataFim);
    }

    @Transactional(readOnly = true)
    public List<ResumoMesDTO> obterResumoAnual(
            Integer ano, Long contaId, Long categoriaId, TipoCategoria tipo, String token
    ) {
        Long idUsuario = jwtService.extrairId(token);

        // Criando as datas de início e fim para usar o Índice do banco
        LocalDate inicioAno = LocalDate.of(ano, 1, 1);
        LocalDate fimAno = LocalDate.of(ano, 12, 31);

        List<ResumoMesSqlDTO> resultadosSql = transacaoRepository.buscarResumoAnualPivot(
                idUsuario, inicioAno, fimAno, contaId, categoriaId, tipo
        );

        List<ResumoMesDTO> resumoList = new ArrayList<>();

        for (int mes = 1; mes <= 12; mes++) {
            final int mesAtual = mes;
            ResumoMesSqlDTO dadosDoMes = resultadosSql.stream()
                    .filter(r -> r.mes().equals(mesAtual))
                    .findFirst()
                    .orElse(new ResumoMesSqlDTO(mesAtual, BigDecimal.ZERO, BigDecimal.ZERO));

            String mesFormatado = String.format("%02d/%d", mes, ano);
            BigDecimal saldoDoMes = dadosDoMes.receitas().subtract(dadosDoMes.despesas());

            resumoList.add(new ResumoMesDTO(mesFormatado, dadosDoMes.receitas(), dadosDoMes.despesas(), saldoDoMes));
        }

        return resumoList;
    }
}