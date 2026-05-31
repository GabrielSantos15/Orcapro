package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.dto.AporteRequestDTO;
import br.com.fiap.orcapro.dto.AtualizarSaldoRequestDTO;
import br.com.fiap.orcapro.dto.InvestimentoResponseDTO;
import br.com.fiap.orcapro.dto.ResgateRequestDTO;
import br.com.fiap.orcapro.model.Investimento;
import br.com.fiap.orcapro.service.InvestimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investimento")
public class InvestimentoController {

    private final InvestimentoService investimentoService;

    public InvestimentoController(InvestimentoService investimentoService) {
        this.investimentoService = investimentoService;
    }

    private String extrairToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.replace("Bearer ", "").trim();
        }
        throw new RuntimeException("Token inválido");
    }

    // ======================================================
    // CRUD
    // ======================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvestimentoResponseDTO salvar(
            @RequestBody Investimento investimento,
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.salvar(
                investimento,
                extrairToken(token)
        );
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InvestimentoResponseDTO buscarPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.buscarPorId(
                id,
                extrairToken(token)
        );
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InvestimentoResponseDTO> buscarTodos(
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.buscarTodos(
                extrairToken(token)
        );
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InvestimentoResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody Investimento investimento,
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.atualizar(
                id,
                investimento,
                extrairToken(token)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        investimentoService.excluir(
                id,
                extrairToken(token)
        );
    }

    // ======================================================
    // OPERAÇÕES FINANCEIRAS
    // ======================================================

    @PutMapping("/{id}/resgatar")
    @ResponseStatus(HttpStatus.OK)
    public InvestimentoResponseDTO resgatar(
            @PathVariable Long id,
            @RequestBody ResgateRequestDTO resgateDTO,
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.resgatar(
                id,
                resgateDTO,
                extrairToken(token)
        );
    }

    @PostMapping("/{id}/aportar")
    @ResponseStatus(HttpStatus.OK)
    public InvestimentoResponseDTO aportar(
            @PathVariable Long id,
            @RequestBody AporteRequestDTO aporteDTO,
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.aportar(
                id,
                aporteDTO,
                extrairToken(token)
        );
    }

    @PatchMapping("/{id}/saldo")
    @ResponseStatus(HttpStatus.OK)
    public InvestimentoResponseDTO atualizarSaldo(
            @PathVariable Long id,
            @RequestBody AtualizarSaldoRequestDTO dto,
            @RequestHeader("Authorization") String token
    ) {
        return investimentoService.atualizarSaldo(
                id,
                dto,
                extrairToken(token)
        );
    }
}