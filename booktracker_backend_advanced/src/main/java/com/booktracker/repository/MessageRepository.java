package com.booktracker.repository;

import com.booktracker.entity.Message;
import com.booktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndReceiverOrSenderAndReceiverOrderBySentAtAsc(
            User sender1, User receiver1, User sender2, User receiver2
    );

    List<Message> findByReceiverAndIsReadFalseOrderBySentAtDesc(User receiver);

    List<Message> findByReceiverAndSenderAndIsReadFalse(User receiver, User sender);

    // NOUVEAU : Vérifier qu'un message appartient à l'utilisateur
    @Query("SELECT m FROM Message m WHERE m.id = :messageId AND (m.sender = :user OR m.receiver = :user)")
    Message findByIdAndUser(@Param("messageId") Long messageId, @Param("user") User user);
}