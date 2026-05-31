package br.com.fiap.orcapro.repository;

import br.com.fiap.orcapro.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaRepository extends JpaRepository <Conta, Long> {
    List<Conta> findByUsuarioId(Long usuarioId);
}
