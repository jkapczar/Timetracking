package core.model;

import core.model.Group;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

@NodeEntity
@Data
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @Property(name = "username")
    private String username;

    private Group memberOf;

    private Group teamLeaderIn;
}