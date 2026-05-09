package com.booktracker.repository;

import com.booktracker.entity.ChatGroup;
import com.booktracker.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {

    @Query("SELECT gm.chatGroup FROM GroupMember gm WHERE gm.user.id = :userId")
    List<ChatGroup> findMyGroups(@Param("userId") Long userId);
}