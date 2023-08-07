package core.dao;

import core.model.Token;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;



@Transactional
public interface TokenDao extends CrudRepository<Token, Long> {

    @Query("select t from Token t where t.token = :token")
    Token findToken(@Param("token") String token);
}
