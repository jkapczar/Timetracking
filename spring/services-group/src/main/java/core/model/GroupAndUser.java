package core.model;

import lombok.Data;
import org.springframework.data.neo4j.annotation.QueryResult;

import java.util.HashSet;
import java.util.Set;

@QueryResult
@Data
public class GroupAndUser {
    String groupName;
    Set<String> users = new HashSet<>();
}
