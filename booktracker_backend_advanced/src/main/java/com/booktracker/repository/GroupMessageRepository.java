package com.booktracker.repository;

import com.booktracker.entity.ChatGroup;
import com.booktracker.entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {

    List<GroupMessage> findByChatGroupOrderBySentAtAsc(ChatGroup chatGroup);

    GroupMessage findTopByChatGroupOrderBySentAtDesc(ChatGroup chatGroup);

    List<GroupMessage> findByChatGroupAndSentAtAfter(ChatGroup chatGroup, LocalDateTime after);

}