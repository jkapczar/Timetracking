package core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.UserDao;
import core.messaging.Sender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service("UserDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    private UserDao userDao;
    private Sender sender;
    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public UserDetailsServiceImpl(UserDao userDao, Sender sender) {
        this.sender = sender;
        this.userDao = userDao;
    }

    private Set<String> getRoles(String username) {
        Set<String> tmp = new HashSet<>();
        try {
            String input = this.sender.sendUserPrivilegeRequest(username);
            String teamLeader = mapper.readTree(input).get("teamLeader").asText();
            String member = mapper.readTree(input).get("member").asText();
            Set<String> deputy = mapper.convertValue(mapper.readTree(input).get("deputy"), HashSet.class);

            if (!teamLeader.equals("")) {
                tmp.add("GROUPOWNER");
                tmp.add("TL_" + teamLeader);
            }

            if (!member.equals("")) {
                tmp.add("MEMBER");
                tmp.add("MEMBER_" + member);
            }

            if (!deputy.isEmpty()) {
                tmp.add("GROUPOWNER");
                for (String e: deputy) {
                    tmp.add("DEPUTY_" + e);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tmp;
    }

    //TODO users role
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Set<String> tmp = new HashSet<>();
        try {
            core.model.User u = userDao.findByUsername(username);
            if (u != null && u.isActive()) {
                tmp.add("USER");
                if (u.isAdmin()) {
                    tmp.add("ADMIN");
                }
                tmp.addAll(getRoles(u.getUsername()));
                List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                        .commaSeparatedStringToAuthorityList(String.join(", ", tmp));
                return new User(u.getUsername(),u.getPassword(),grantedAuthorities);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        throw new UsernameNotFoundException("Username: " + username + " not found");
    }
}
