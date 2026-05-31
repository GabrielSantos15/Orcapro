package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Categoria;
import br.com.fiap.orcapro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByUsuarioId(Long idUsuario);
    Optional<Categoria> findByNomeAndUsuario(String nome, Usuario usuario);
    Optional<Categoria> findFirstByTipoAndUsuario(TipoCategoria tipo, Usuario usuario);
    Optional<Categoria> findByNomeAndTipoAndUsuario(String nome, TipoCategoria tipo, Usuario usuario); // ← faltou esse
}