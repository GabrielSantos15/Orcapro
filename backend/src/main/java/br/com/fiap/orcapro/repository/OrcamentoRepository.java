package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByUsuarioId(Long usuarioId);
    Optional<Orcamento> findByIdAndUsuarioId(Long id, Long usuarioId);
    boolean existsByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);
}