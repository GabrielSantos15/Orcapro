package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByUsuarioId(Long usuarioId);
    Optional<Orcamento> findByIdAndUsuarioId(Long id, Long usuarioId);
    boolean existsByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);
    List<Orcamento> findByUsuarioIdAndCategoriaTipo(Long usuarioId, TipoCategoria tipo);
}