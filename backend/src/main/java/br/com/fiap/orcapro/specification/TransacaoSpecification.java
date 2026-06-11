package br.com.fiap.orcapro.specification;

import br.com.fiap.orcapro.enums.TipoCategoria;
import br.com.fiap.orcapro.model.Transacao;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TransacaoSpecification {

    public static Specification<Transacao> filtrar(
            Long usuarioId,
            Long categoriaId,
            TipoCategoria tipo,
            LocalDate dataInicio,
            LocalDate dataFim
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    cb.equal(
                            root.get("conta")
                                    .get("usuario")
                                    .get("id"),
                            usuarioId
                    )
            );

            if (categoriaId != null) {
                predicates.add(
                        cb.equal(
                                root.get("categoria")
                                        .get("id"),
                                categoriaId
                        )
                );
            }

            if (tipo != null) {
                predicates.add(
                        cb.equal(
                                root.get("categoria")
                                        .get("tipo"),
                                tipo
                        )
                );
            }

            if (dataInicio != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("dataTransacao"),
                                dataInicio
                        )
                );
            }

            if (dataFim != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("dataTransacao"),
                                dataFim
                        )
                );
            }

            query.orderBy(
                    cb.desc(root.get("dataTransacao")),
                    cb.desc(root.get("id"))
            );

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}