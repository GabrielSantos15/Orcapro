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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria salvar(@RequestBody Categoria categoria,
                            @RequestHeader("Authorization") String token) {
        return categoriaService.salvar(categoria, token.substring(7));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria buscarPorId(@PathVariable Long id,
                                 @RequestHeader("Authorization") String token) {
        return categoriaService.buscarPorId(id, token.substring(7));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Categoria> buscarTodos(@RequestHeader("Authorization") String token) {
        return categoriaService.buscarTodos(token.substring(7));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id,
                        @RequestHeader("Authorization") String token) {
        categoriaService.excluir(id, token.substring(7));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria atualizar(@PathVariable Long id,
                               @RequestBody Categoria categoria,
                               @RequestHeader("Authorization") String token) {
        return categoriaService.atualizar(id, categoria, token.substring(7));
    }
}