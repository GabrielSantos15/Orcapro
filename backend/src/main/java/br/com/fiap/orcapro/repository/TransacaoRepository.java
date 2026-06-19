package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.dto.ResumoCategoriaDTO;
import br.com.fiap.orcapro.dto.ResumoMesSqlDTO;
import br.com.fiap.orcapro.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransacaoRepository extends
        JpaRepository<Transacao, Long>,
        JpaSpecificationExecutor<Transacao> {

    List<Transacao> findByContaUsuarioId(Long idUsuario);
    List<Transacao> findByContaId(Long idConta);
    List<Transacao> findByCategoriaId(Long idCategoria);
    boolean existsByContaId(Long contaId);
    boolean existsByCategoriaId(Long categoriaId);

    // Ordena pela data e desempata pelo ID
    List<Transacao> findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(Long usuarioId);

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
            SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.ENTRADA THEN t.valor END),
            SUM(CASE WHEN c.tipo = br.com.fiap.orcapro.enums.TipoCategoria.SAIDA THEN t.valor END)
        )
        FROM Transacao t
        JOIN t.categoria c
        JOIN t.conta co
        WHERE co.usuario.id = :usuarioId
          AND YEAR(t.dataTransacao) = :ano
        GROUP BY MONTH(t.dataTransacao)
        ORDER BY MONTH(t.dataTransacao)
    """)
    List<ResumoMesSqlDTO> buscarResumoAnualPivot(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") Integer ano
    );
}