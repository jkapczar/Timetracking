package zuul.security;

import common.security.JwtConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletResponse;
@EnableWebSecurity
public class TokenConfig extends WebSecurityConfigurerAdapter {

    private JwtConfig jwtConfig;

    @Autowired
    public TokenConfig(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        System.out.println(jwtConfig.getUri());

        http    .headers().frameOptions().disable().and()
                .cors().and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .exceptionHandling().authenticationEntryPoint((req, rsp, e) -> rsp.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                .and()
                .addFilterAfter(new TokenAuthenticationFilter(jwtConfig), UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()

                //login reg pwreset wo auth
                .antMatchers(HttpMethod.POST, "/auth/**").permitAll()
                .antMatchers(HttpMethod.GET, "/auth/**").permitAll()
                //user management
                //.antMatchers(HttpMethod.GET, "/users/**").authenticated()
                .antMatchers(HttpMethod.GET, "/users/**").permitAll()
                .antMatchers(HttpMethod.POST, "/users/**").permitAll()
                .antMatchers(HttpMethod.DELETE, "/users/**").permitAll()
                // group management
                .antMatchers(HttpMethod.GET, "/groups/**").permitAll()
                .antMatchers(HttpMethod.POST, "/groups/**").permitAll()
                .antMatchers(HttpMethod.DELETE, "/groups/**").permitAll()
                // calendar
                .antMatchers(HttpMethod.GET, "/calendar/**").permitAll()
                .antMatchers(HttpMethod.POST, "/calendar/**").permitAll()
                .antMatchers(HttpMethod.DELETE, "/calendar/**").permitAll()
                .antMatchers(HttpMethod.GET, "/notification/**").permitAll()
                .antMatchers(HttpMethod.POST, "/notification/**").permitAll()
                .anyRequest().authenticated();
    }
}
