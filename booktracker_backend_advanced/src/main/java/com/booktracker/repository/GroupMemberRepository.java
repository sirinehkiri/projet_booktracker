package com.booktracker.repository;

import com.booktracker.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository
        extends JpaRepository<GroupMember, Long> {

    Optional<GroupMember> findByChatGroup_IdAndUser_Id(
            Long groupId,
            Long userId
    );

    List<GroupMember> findByChatGroup_Id(Long groupId);

    boolean existsByChatGroup_IdAndUser_Id(
            Long groupId,
            Long userId
    );
}