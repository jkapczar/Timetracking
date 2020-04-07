package core.security;

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

    @Autowired
    public UserDetailsServiceImpl(UserDao userDao, Sender sender) {
        this.sender = sender;
        this.userDao = userDao;
    }


    //TODO users role
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Set<String> tmp = new HashSet<>();
        try {
            tmp = this.sender.sendUserPrivilegeRequest(username);
            if (tmp != null) {
                tmp = tmp.stream().map(e -> "Group_".concat(e)).collect(Collectors.toSet());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            core.model.User u = userDao.findByUsername(username);
            tmp.add("USER");
            if (u.isAdmin()) {
                tmp.add("ADMIN");
            }
            List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                    .commaSeparatedStringToAuthorityList(String.join(", ", tmp));

            return new User(u.getUsername(),u.getPassword(),grantedAuthorities);
        } catch (Exception e) {
            e.printStackTrace();
            throw new UsernameNotFoundException("Username: " + username + " not found");
        }
    }
}
