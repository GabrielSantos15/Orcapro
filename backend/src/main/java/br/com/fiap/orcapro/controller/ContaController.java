package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.dto.ContaResponseDTO;
import br.com.fiap.orcapro.model.Conta;
import br.com.fiap.orcapro.service.ContaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conta")
public class ContaController {

    private final ContaService contaService;

    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    private String extrairToken(String token) {

        if (
                token != null &&
                        token.startsWith("Bearer ")
        ) {

            return token
                    .replace("Bearer ", "")
                    .trim();
        }

        throw new RuntimeException("Token inválido");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContaResponseDTO salvar(
            @RequestBody Conta conta,
            @RequestHeader("Authorization") String token
    ) {

        return contaService.salvar(
                conta,
                extrairToken(token)
        );
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ContaResponseDTO buscarPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        return contaService.buscarPorId(
                id,
                extrairToken(token)
        );
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ContaResponseDTO> buscarTodos(
            @RequestHeader("Authorization") String token
    ) {

        return contaService.buscarTodos(
                extrairToken(token)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        contaService.excluir(
                id,
                extrairToken(token)
        );
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ContaResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody Conta conta,
            @RequestHeader("Authorization") String token
    ) {

        return contaService.atualizar(
                id,
                conta,
                extrairToken(token)
        );
    }
}