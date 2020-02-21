package auth.security;

import auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("UserDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    private UserService userService;

    @Autowired
    public UserDetailsServiceImpl(UserService userService) {
        this.userService = userService;
    }


    //TODO users role
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        try {
            auth.model.User u = userService.findUserByUsername(username);
            List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList("USER");
            return new User(u.getUsername(),u.getPassword(),grantedAuthorities);
        } catch (Exception e) {
            e.printStackTrace();
            throw new UsernameNotFoundException("Username: " + username + " not found");
        }
    }
}
