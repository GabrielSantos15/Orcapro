package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {
    List<Investimento> findByUsuarioId(Long idUsuario);
    boolean existsByContaId(Long contaId);
}