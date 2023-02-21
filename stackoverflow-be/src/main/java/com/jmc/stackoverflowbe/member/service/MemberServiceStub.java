package com.jmc.stackoverflowbe.member.service;

import com.jmc.stackoverflowbe.member.entity.Member;
import com.jmc.stackoverflowbe.member.entity.Member.MemberState;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceStub implements MemberService {

    @Override
    public Member createMember(Member member) {
        return null;
    }

    @Override
    public Member updateMember(Member member) {
        return null;
    }

    @Override
    public Member getMember(Long id) {
        return Member.builder()
            .id(id)
            .email("hgd@gmail.com")
            .name("홍길동")
            .state(MemberState.ACTIVE)
            .build();
    }

    @Override
    public void deleteMember(Long id) {

    }

    @Override
    public void verifyExistName(String Name) {

    }

    @Override
    public Member findExistId(Long id) {
        return null;
    }
}
