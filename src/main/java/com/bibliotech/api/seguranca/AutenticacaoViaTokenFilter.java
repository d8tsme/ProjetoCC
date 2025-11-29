package com.bibliotech.api.seguranca;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AutenticacaoViaTokenFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;
    @Autowired
    private AutenticacaoService autenticacaoService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String rawAuth = request.getHeader("Authorization");
        if (rawAuth != null && rawAuth.startsWith("Bearer ")) {
            System.out.println("AutenticacaoViaTokenFilter: Authorization header present");
        } else if (rawAuth != null) {
            System.out.println("AutenticacaoViaTokenFilter: Authorization header present but not Bearer token");
        } else {
            System.out.println("AutenticacaoViaTokenFilter: no Authorization header present");
        }
        String token = recuperarToken(request);
        if (token != null && tokenService.isTokenValido(token)) {
            String username = tokenService.getUsuario(token);
            System.out.println("AutenticacaoViaTokenFilter: token valid for user=" + username);
            UserDetails userDetails = autenticacaoService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }

    public String recuperarToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return null;
        }
        return token.substring(7);
    }
}
