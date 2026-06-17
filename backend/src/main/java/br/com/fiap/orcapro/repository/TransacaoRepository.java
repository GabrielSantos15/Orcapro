package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TransacaoRepository extends
        JpaRepository<Transacao, Long>,
        JpaSpecificationExecutor<Transacao> {

    List<Transacao> findByContaUsuarioId(Long idUsuario);
    List<Transacao> findByContaId(Long idConta);
    List<Transacao> findByCategoriaId(Long idCategoria);
    boolean existsByContaId(Long contaId);
    boolean existsByCategoriaId(Long categoriaId);
    // Ordena pela data e desempata pelo ID (no front eu envio apenas a data sem hora, o que atrapalha na hora de ordenar)
    List<Transacao> findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(Long usuarioId);
}