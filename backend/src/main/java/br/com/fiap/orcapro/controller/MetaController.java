package br.com.fiap.orcapro.controller;

import br.com.fiap.orcapro.dto.MetaResponseDTO;
import br.com.fiap.orcapro.dto.ProgressoMetaRequestDTO;
import br.com.fiap.orcapro.model.Meta;
import br.com.fiap.orcapro.service.MetaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meta")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }


    private String extrairToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.replace("Bearer ", "").trim();
        }
        throw new RuntimeException("Token inválido");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MetaResponseDTO salvar(
            @RequestBody Meta meta,
            @RequestHeader("Authorization") String token
    ) {
        return metaService.salvar(meta, extrairToken(token));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MetaResponseDTO buscarPorId(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        return metaService.buscarPorId(id, extrairToken(token));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<MetaResponseDTO> buscarTodos(
            @RequestHeader("Authorization") String token
    ) {
        return metaService.buscarTodos(extrairToken(token));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        metaService.excluir(id, extrairToken(token));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MetaResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody Meta meta,
            @RequestHeader("Authorization") String token
    ) {
        return metaService.atualizar(id, meta, extrairToken(token));
    }

    @PatchMapping("/{id}/progresso")
    @ResponseStatus(HttpStatus.OK)
    public MetaResponseDTO atualizarProgresso(
            @PathVariable Long id,
            @RequestBody ProgressoMetaRequestDTO dto,
            @RequestHeader("Authorization") String token
    ) {
        return metaService.atualizarProgresso(id, dto, extrairToken(token));
    }

    @PatchMapping("/{id}/resgate")
    @ResponseStatus(HttpStatus.OK)
    public MetaResponseDTO resgatarProgresso(
            @PathVariable Long id,
            @RequestBody ProgressoMetaRequestDTO dto,
            @RequestHeader("Authorization") String token
    ) {
        return metaService.resgatarProgresso(id, dto, extrairToken(token));
    }
}