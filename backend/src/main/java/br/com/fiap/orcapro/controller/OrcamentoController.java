package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.dto.OrcamentoRequestDTO;
import br.com.fiap.orcapro.dto.OrcamentoResponseDTO;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.service.OrcamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orcamento")
public class OrcamentoController {

    private final OrcamentoService orcamentoService;

    public OrcamentoController(OrcamentoService orcamentoService) {
        this.orcamentoService = orcamentoService;
    }

    private String extrairToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.replace("Bearer ", "").trim();
        }
        throw new RuntimeException("Token inválido");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrcamentoResponseDTO criar(
            @Valid @RequestBody OrcamentoRequestDTO dto,
            @RequestHeader("Authorization") String token
    ) {
        return orcamentoService.criar(dto, extrairToken(token));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public OrcamentoResponseDTO buscarPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        return orcamentoService.buscarPorId(id, extrairToken(token));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<OrcamentoResponseDTO> listarTodos(
            @RequestParam(required = false) TipoCategoria tipo,
            @RequestHeader("Authorization") String token
    ) {
        return orcamentoService.listarTodos(tipo, extrairToken(token));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public OrcamentoResponseDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody OrcamentoRequestDTO dto,
            @RequestHeader("Authorization") String token
    ) {
        return orcamentoService.atualizar(id, dto, extrairToken(token));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        orcamentoService.excluir(id, extrairToken(token));
    }
}