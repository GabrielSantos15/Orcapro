package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
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
    public Categoria salvar(
            @RequestBody Categoria categoria,
            @RequestHeader("Authorization") String token
    ) {

        return categoriaService.salvar(
                categoria,
                extrairToken(token)
        );
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria buscarPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        return categoriaService.buscarPorId(
                id,
                extrairToken(token)
        );
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Categoria> buscarTodos(
            @RequestHeader("Authorization") String token
    ) {

        return categoriaService.buscarTodos(
                extrairToken(token)
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        categoriaService.excluir(
                id,
                extrairToken(token)
        );
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria atualizar(
            @PathVariable Long id,
            @RequestBody Categoria categoria,
            @RequestHeader("Authorization") String token
    ) {

        return categoriaService.atualizar(
                id,
                categoria,
                extrairToken(token)
        );
    }
}