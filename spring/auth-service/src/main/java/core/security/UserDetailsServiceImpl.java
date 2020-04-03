package core.security;

import core.dao.UserDao;
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

    private UserDao userDao;

    @Autowired
    public UserDetailsServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }


    //TODO users role
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        try {
            core.model.User u = userDao.findByUsername(username);
            List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList("USER");
            return new User(u.getUsername(),u.getPassword(),grantedAuthorities);
        } catch (Exception e) {
            e.printStackTrace();
            throw new UsernameNotFoundException("Username: " + username + " not found");
        }
    }
}
