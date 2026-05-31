package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByContaUsuarioId(Long idUsuario);
    List<Transacao> findByContaId(Long idConta);
    List<Transacao> findByCategoriaId(Long idCategoria);
    boolean existsByContaId(Long contaId);
    // Ordena pela data e desempata pelo ID (no front eu envio apenas a data sem hora, o que atrapalha na hora de ordenar)
    List<Transacao> findByContaUsuarioIdOrderByDataTransacaoDescIdDesc(Long usuarioId);
}