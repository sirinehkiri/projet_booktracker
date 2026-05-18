package com.booktracker.services;

import com.booktracker.entity.ReadingStatus;
import com.booktracker.entity.UserBook;
import com.booktracker.model.dto.MonthlyStatsDTO;
import com.booktracker.model.dto.ReadingStatsDTO;
import com.booktracker.model.dto.StatsLabelDTO;
import com.booktracker.repository.UserBookRepository;

import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final UserBookRepository userBookRepository;

    public StatisticsService(UserBookRepository userBookRepository) {
        this.userBookRepository = userBookRepository;
    }

    /* =====================================================
       GLOBAL STATS
    ===================================================== */

    public ReadingStatsDTO getGlobalStatistics(Long userId) {

        List<UserBook> books =
                userBookRepository.findByUserId(userId);

        ReadingStatsDTO dto = new ReadingStatsDTO();

        long totalRead =
                userBookRepository.countByUserIdAndStatus(
                        userId,
                        ReadingStatus.READ
                );

        long currentlyReading =
                userBookRepository.countByUserIdAndStatus(
                        userId,
                        ReadingStatus.READING
                );

        long wantToRead =
                userBookRepository.countByUserIdAndStatus(
                        userId,
                        ReadingStatus.WANT_TO_READ
                );

        dto.setTotalBooksRead(totalRead);
        dto.setCurrentlyReading(currentlyReading);
        dto.setWantToRead(wantToRead);

        int totalPages = books.stream()
                .filter(book -> book.getStatus() == ReadingStatus.READ)
                .mapToInt(UserBook::getPagesRead)
                .sum();

        dto.setTotalPagesRead(totalPages);

        dto.setTotalReadingHours(totalPages / 30.0);

        /* =========================
           FAVORITE GENRE
        ========================= */

        Map<String, Long> genreMap = books.stream()

                .filter(book -> book.getStatus() == ReadingStatus.READ)

                .filter(book -> book.getBook() != null)

                .filter(book -> book.getBook().getGenre() != null)

                .collect(Collectors.groupingBy(
                        book -> book.getBook().getGenre(),
                        Collectors.counting()
                ));

        dto.setFavoriteGenre(

                genreMap.entrySet()
                        .stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("Aucun")
        );

        /* =========================
           FAVORITE AUTHOR
        ========================= */

        Map<String, Long> authorMap = books.stream()

                .filter(book -> book.getStatus() == ReadingStatus.READ)

                .filter(book -> book.getBook() != null)

                .filter(book -> book.getBook().getAuthor() != null)

                .collect(Collectors.groupingBy(
                        book -> book.getBook().getAuthor(),
                        Collectors.counting()
                ));

        dto.setFavoriteAuthor(

                authorMap.entrySet()
                        .stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("Aucun")
        );

        return dto;
    }

    /* =====================================================
       GENRE STATS
    ===================================================== */

    public List<StatsLabelDTO> getGenreStatistics(Long userId) {

        List<UserBook> books =
                userBookRepository.findByUserId(userId);

        Map<String, Long> genreMap = books.stream()

                .filter(book -> book.getStatus() == ReadingStatus.READ)

                .filter(book -> book.getBook() != null)

                .filter(book -> book.getBook().getGenre() != null)

                .collect(Collectors.groupingBy(
                        book -> book.getBook().getGenre(),
                        Collectors.counting()
                ));

        return genreMap.entrySet()

                .stream()

                .map(entry ->
                        new StatsLabelDTO(
                                entry.getKey(),
                                entry.getValue()
                        )
                )

                .sorted(
                        Comparator.comparing(
                                StatsLabelDTO::getTotal
                        ).reversed()
                )

                .toList();
    }

    /* =====================================================
       AUTHOR STATS
    ===================================================== */

    public List<StatsLabelDTO> getAuthorStatistics(Long userId) {

        List<UserBook> books =
                userBookRepository.findByUserId(userId);

        Map<String, Long> authorMap = books.stream()

                .filter(book -> book.getStatus() == ReadingStatus.READ)

                .filter(book -> book.getBook() != null)

                .filter(book -> book.getBook().getAuthor() != null)

                .collect(Collectors.groupingBy(
                        book -> book.getBook().getAuthor(),
                        Collectors.counting()
                ));

        return authorMap.entrySet()

                .stream()

                .map(entry ->
                        new StatsLabelDTO(
                                entry.getKey(),
                                entry.getValue()
                        )
                )

                .sorted(
                        Comparator.comparing(
                                StatsLabelDTO::getTotal
                        ).reversed()
                )

                .toList();
    }

    /* =====================================================
       MONTHLY STATS
    ===================================================== */

    public List<MonthlyStatsDTO> getMonthlyStatistics(Long userId) {

        List<UserBook> books =
                userBookRepository.findByUserId(userId);

        Map<String, Long> monthlyMap = new LinkedHashMap<>();

        for (Month month : Month.values()) {

            String monthName =
                    month.getDisplayName(
                            TextStyle.SHORT,
                            Locale.ENGLISH
                    );

            monthlyMap.put(monthName, 0L);
        }

        books.stream()

                .filter(book -> book.getStatus() == ReadingStatus.READ)

                .filter(book -> book.getFinishDate() != null)

                .forEach(book -> {

                    String monthName =
                            book.getFinishDate()
                                    .getMonth()
                                    .getDisplayName(
                                            TextStyle.SHORT,
                                            Locale.ENGLISH
                                    );

                    monthlyMap.put(
                            monthName,
                            monthlyMap.get(monthName) + 1
                    );
                });

        return monthlyMap.entrySet()

                .stream()

                .map(entry ->
                        new MonthlyStatsDTO(
                                entry.getKey(),
                                entry.getValue()
                        )
                )

                .toList();
    }

    /* =====================================================
       STATUS STATS
    ===================================================== */

    public Map<String, Long> getStatusStatistics(Long userId) {

        Map<String, Long> stats = new HashMap<>();

        stats.put(
                "completed",
                userBookRepository.countByUserIdAndStatus(
                        userId,
                        ReadingStatus.READ
                )
        );

        stats.put(
                "reading",
                userBookRepository.countByUserIdAndStatus(
                        userId,
                        ReadingStatus.READING
                )
        );

        stats.put(
                "wantToRead",
                userBookRepository.countByUserIdAndStatus(
                        userId,
                        ReadingStatus.WANT_TO_READ
                )
        );

        return stats;
    }
}