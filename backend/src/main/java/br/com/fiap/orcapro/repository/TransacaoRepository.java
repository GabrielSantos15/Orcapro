package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.dto.ResumoCategoriaDTO;
import br.com.fiap.orcapro.dto.ResumoMesSqlDTO;
import br.com.fiap.orcapro.dto.ResumoTransacaoDTO;
import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Transacao;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransacaoRepository extends
        JpaRepository<Transacao, Long>,
        JpaSpecificationExecutor<Transacao> {

    @Override
    @EntityGraph(attributePaths = {"conta", "categoria"})
    List<Transacao> findAll(Specification<Transacao> spec);

    @EntityGraph(attributePaths = {"conta", "categoria"})
    List<Transacao> findByContaUsuarioId(Long idUsuario);

    @EntityGraph(attributePaths = {"conta", "categoria"})
    List<Transacao> findByContaId(Long idConta);

    @EntityGraph(attributePaths = {"conta", "categoria"})
    List<Transacao> findByCategoriaId(Long idCategoria);

    boolean existsByContaId(Long contaId);
    boolean existsByCategoriaId(Long categoriaId);

    @EntityGraph(attributePaths = {"conta", "categoria"})
    List<Transacao> findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(Long usuarioId);

    @Query("""
        SELECT new br.com.fiap.orcapro.dto.ResumoTransacaoDTO(
            COALESCE(SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.ENTRADA THEN t.valor ELSE 0 END), 0),
            COALESCE(SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.SAIDA THEN t.valor ELSE 0 END), 0),
            COALESCE(SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.ENTRADA THEN t.valor ELSE -t.valor END), 0),
            COUNT(t.id)
        )
        FROM Transacao t
        JOIN t.categoria c
        JOIN t.conta co
        WHERE co.usuario.id = :usuarioId
          AND t.dataTransacao BETWEEN :dataInicio AND :dataFim
    """)
    ResumoTransacaoDTO buscarResumoAgrupado(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );


    @Query("SELECT new br.com.fiap.orcapro.dto.ResumoCategoriaDTO(c.id, c.nome, c.tipo, SUM(t.valor), COUNT(t.id)) " +
            "FROM Transacao t JOIN t.categoria c JOIN t.conta co " +
            "WHERE co.usuario.id = :usuarioId AND t.dataTransacao BETWEEN :dataInicio AND :dataFim " +
            "GROUP BY c.id, c.nome, c.tipo " +
            "ORDER BY SUM(t.valor) DESC")

    List<ResumoCategoriaDTO> buscarResumoPorCategoriaNoPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    @Query("""
        SELECT new br.com.fiap.orcapro.dto.ResumoMesSqlDTO(
            MONTH(t.dataTransacao),
            COALESCE(SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.ENTRADA THEN t.valor END), 0),
            COALESCE(SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.SAIDA THEN t.valor END), 0)
        )
        FROM Transacao t
        JOIN t.categoria c
        JOIN t.conta co
        WHERE co.usuario.id = :usuarioId
          AND t.dataTransacao >= :inicioAno AND t.dataTransacao <= :fimAno
          AND (:contaId IS NULL OR co.id = :contaId)
          AND (:categoriaId IS NULL OR c.id = :categoriaId)
          AND (:tipo IS NULL OR c.tipo = :tipo)
        GROUP BY MONTH(t.dataTransacao)
        ORDER BY MONTH(t.dataTransacao)
    """)
    List<ResumoMesSqlDTO> buscarResumoAnualPivot(
            @Param("usuarioId") Long usuarioId,
            @Param("inicioAno") LocalDate inicioAno,
            @Param("fimAno") LocalDate fimAno,
            @Param("contaId") Long contaId,
            @Param("categoriaId") Long categoriaId,
            @Param("tipo") TipoCategoria tipo
    );
}