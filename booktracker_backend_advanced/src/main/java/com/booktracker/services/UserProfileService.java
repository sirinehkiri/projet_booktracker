package com.booktracker.services;

import com.booktracker.entity.*;
import com.booktracker.model.dto.*;
import com.booktracker.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserBookRepository userBookRepository;
    private final ReviewRepository reviewRepository;
    private final FollowRequestRepository followRequestRepository;

    public UserProfileService(
            UserRepository userRepository,
            UserBookRepository userBookRepository,
            ReviewRepository reviewRepository,
            FollowRequestRepository followRequestRepository
    ) {
        this.userRepository = userRepository;
        this.userBookRepository = userBookRepository;
        this.reviewRepository = reviewRepository;
        this.followRequestRepository = followRequestRepository;
    }

    // =====================================================
    // GET USER PROFILE
    // =====================================================

    public UserProfileResponse getUserProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        UserProfileResponse response =
                new UserProfileResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setImage(user.getImage());

        // =====================================================
        // 1. STATS
        // =====================================================

        // Followers
        response.setFollowersCount(
                followRequestRepository
                        .countByReceiverIdAndStatus(
                                userId, "ACCEPTED"
                        )
        );

        // Following -
        response.setFollowingCount(
                followRequestRepository
                        .countBySenderIdAndStatus(
                                userId, "ACCEPTED"
                        )
        );

        // ✅ FRIENDS -
        response.setFriendsCount(
                followRequestRepository
                        .countFriendsByUserId(userId)
        );

        // Books read count
        response.setReadBooksCount(
                userBookRepository
                        .countByUserIdAndStatus(
                                userId,
                                ReadingStatus.READ
                        )
        );

        // =====================================================
        // 2. LIVRES LUS
        // =====================================================

        List<UserBook> readBooks =
                userBookRepository
                        .findByUserIdAndStatus(
                                userId,
                                ReadingStatus.READ
                        );

        response.setReadBooks(
                readBooks.stream()
                        .map(ub -> new BookSummaryDto(
                                ub.getBook().getId(),
                                ub.getBook().getTitle(),
                                ub.getBook().getAuthor(),
                                ub.getBook().getPic()
                        ))
                        .collect(Collectors.toList())
        );

        // =====================================================
        // 3. REVIEWS
        // =====================================================

        List<Review> reviews =
                reviewRepository
                        .findByUserIdOrderByDateDesc(
                                userId
                        );

        response.setReviews(
                reviews.stream()
                        .map(r -> {
                            ReviewSummaryDto dto =
                                    new ReviewSummaryDto();

                            dto.setId(r.getId());
                            dto.setBookId(
                                    r.getBook().getId()
                            );
                            dto.setBookTitle(
                                    r.getBook().getTitle()
                            );
                            dto.setBookPic(
                                    r.getBook().getPic()
                            );
                            dto.setRating(r.getRating());
                            dto.setComment(r.getComment());
                            dto.setDate(r.getDate());

                            return dto;
                        })
                        .collect(Collectors.toList())
        );

        // =====================================================
        // 4. FRIEND RECOMMENDATIONS
        // =====================================================

        List<Long> friendsIds =
                followRequestRepository
                        .findFollowingIdsByUserId(userId);

        if (friendsIds != null &&
                !friendsIds.isEmpty()) {

            List<Review> friendsTopReviews =
                    reviewRepository
                            .findByUserIdInAndRatingGreaterThanEqual(
                                    friendsIds, 4
                            );

            List<BookSummaryDto> recommendations =
                    friendsTopReviews.stream()
                            .map(Review::getBook)
                            .distinct()
                            .map(b -> new BookSummaryDto(
                                    b.getId(),
                                    b.getTitle(),
                                    b.getAuthor(),
                                    b.getPic()
                            ))
                            .limit(10)
                            .collect(Collectors.toList());

            response.setFriendRecommendations(
                    recommendations
            );

        } else {
            response.setFriendRecommendations(
                    new ArrayList<>()
            );
        }

        return response;
    }
}