package com.jmc.stackoverflowbe.auth.oauth.handler;

import com.jmc.stackoverflowbe.auth.oauth.jwt.JwtTokenizer;
import com.jmc.stackoverflowbe.auth.oauth.utils.CustomAuthorityUtils;
import com.jmc.stackoverflowbe.member.entity.Member;
import com.jmc.stackoverflowbe.member.service.MemberService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OAuth2MemberSuccessHandler extends SimpleUrlAuthenticationSuccessHandler { // (1)
    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtils authorityUtils;
    private final MemberService memberService;

    // (2)
    public OAuth2MemberSuccessHandler(JwtTokenizer jwtTokenizer,
            CustomAuthorityUtils authorityUtils,
            MemberService memberService) {
        this.jwtTokenizer = jwtTokenizer;
        this.authorityUtils = authorityUtils;
        this.memberService = memberService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        var oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = String.valueOf(oAuth2User.getAttributes().get("email")); // (3)
        String name = String.valueOf(oAuth2User.getAttributes().get("name")); // (3)
        List<String> authorities = authorityUtils.createRoles(email); // (4)

        saveMember(email, name); // (5)
        redirect(request, response, email, authorities); // (6)
    }

    private void saveMember(String email, String name) {
        Member member = Member.builder()
                .email(email)
                .name(name)
                .build();

        memberService.createMember(member);
    }

    private void redirect(HttpServletRequest request, HttpServletResponse response, String username,
            List<String> authorities) throws IOException {
        String accessToken = delegateAccessToken(username, authorities); // (6-1)
        String refreshToken = delegateRefreshToken(username); // (6-2)

        String uri = createURI(accessToken, refreshToken).toString(); // (6-3)
        getRedirectStrategy().sendRedirect(request, response, uri); // (6-4)
    }

    private String delegateAccessToken(String username, List<String> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("roles", authorities);

        String subject = username;
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getAccessTokenExpirationMinutes());

        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        String accessToken = jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);

        return accessToken;
    }

    private String delegateRefreshToken(String username) {
        String subject = username;
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getRefreshTokenExpirationMinutes());
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        String refreshToken = jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);

        return refreshToken;
    }

    private URI createURI(String accessToken, String refreshToken) {
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("access_token", accessToken);
        queryParams.add("refresh_token", refreshToken);

        return UriComponentsBuilder
                .newInstance()
                .scheme("http")
                .host("localhost")
                .path("/")
                .queryParams(queryParams)
                .build()
                .toUri();
    }

}