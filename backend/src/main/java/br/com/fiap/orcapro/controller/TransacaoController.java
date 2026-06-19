package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.dto.*;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Transacao;
import br.com.fiap.orcapro.service.TransacaoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transacao")
public class TransacaoController {

    private final TransacaoService transacaoService;

    public TransacaoController(
            TransacaoService transacaoService
    ) {

        this.transacaoService = transacaoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransacaoResponseDTO salvar(
            @RequestBody Transacao transacao,
            @RequestHeader("Authorization") String token
    ) {

        return transacaoService.salvar(
                transacao,
                token.substring(7)
        );
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TransacaoResponseDTO buscarPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        return transacaoService.buscarPorId(
                id,
                token.substring(7)
        );
    }

    @GetMapping("")
    public ResponseEntity<List<TransacaoResponseDTO>> filtrar(
            TransacaoFiltroDTO filtro,
            @RequestHeader("Authorization") String token
    ) {

        return ResponseEntity.ok(
                transacaoService.buscarComFiltro(
                        filtro,
                        token.substring(7)
                )
        );
    }

//    @GetMapping
//    @ResponseStatus(HttpStatus.OK)
//    public List<TransacaoResponseDTO> buscarTodos(
//            @RequestHeader("Authorization") String token
//    ) {
//
//        return transacaoService.buscarTodos(
//                token.substring(7)
//        );
//    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        transacaoService.excluir(
                id,
                token.substring(7)
        );
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TransacaoResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody Transacao transacao,
            @RequestHeader("Authorization") String token
    ) {

        return transacaoService.atualizar(
                id,
                transacao,
                token.substring(7)
        );
    }

    @GetMapping("/resumo")
    @ResponseStatus(HttpStatus.OK)
    public ResumoTransacaoDTO resumo(
            TransacaoFiltroDTO filtro,
            @RequestHeader("Authorization") String token
    ) {

        return transacaoService.buscarResumo(
                filtro,
                token.substring(7)
        );
    }

    @GetMapping("/resumo/anual")
    public ResponseEntity<List<ResumoMesDTO>> obterResumoAnual(
            @RequestParam Integer ano,
            @RequestParam(required = false) Long contaId,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) TipoCategoria tipo,
            @RequestHeader("Authorization") String token
    ) {
        String tokenLimpo = token != null ? token.replace("Bearer ", "") : "";

        List<ResumoMesDTO> resumo = transacaoService.obterResumoAnual(
                ano, contaId, categoriaId, tipo, tokenLimpo
        );

        return ResponseEntity.ok(resumo);
    }
}