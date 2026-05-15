package com.booktracker.controller;

import com.booktracker.model.dto.MonthlyStatsDTO;
import com.booktracker.model.dto.ReadingStatsDTO;
import com.booktracker.model.dto.StatsLabelDTO;
import com.booktracker.services.StatisticsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:4200")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(
            StatisticsService statisticsService
    ) {
        this.statisticsService = statisticsService;
    }

    /* =====================================================
       GLOBAL STATISTICS
    ===================================================== */

    @GetMapping("/global/{userId}")
    public ResponseEntity<ReadingStatsDTO> getGlobalStatistics(
            @PathVariable Long userId
    ) {

        ReadingStatsDTO stats =
                statisticsService.getGlobalStatistics(userId);

        return ResponseEntity.ok(stats);
    }

    /* =====================================================
       GENRES
    ===================================================== */

    @GetMapping("/genres/{userId}")
    public ResponseEntity<List<StatsLabelDTO>> getGenreStatistics(
            @PathVariable Long userId
    ) {

        List<StatsLabelDTO> genres =
                statisticsService.getGenreStatistics(userId);

        return ResponseEntity.ok(genres);
    }

    /* =====================================================
       AUTHORS
    ===================================================== */

    @GetMapping("/authors/{userId}")
    public ResponseEntity<List<StatsLabelDTO>> getAuthorStatistics(
            @PathVariable Long userId
    ) {

        List<StatsLabelDTO> authors =
                statisticsService.getAuthorStatistics(userId);

        return ResponseEntity.ok(authors);
    }

    /* =====================================================
       MONTHLY STATS
    ===================================================== */

    @GetMapping("/monthly/{userId}")
    public ResponseEntity<List<MonthlyStatsDTO>> getMonthlyStatistics(
            @PathVariable Long userId
    ) {

        List<MonthlyStatsDTO> monthlyStats =
                statisticsService.getMonthlyStatistics(userId);

        return ResponseEntity.ok(monthlyStats);
    }

    /* =====================================================
       STATUS STATS
    ===================================================== */

    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Long>> getStatusStatistics(
            @PathVariable Long userId
    ) {

        Map<String, Long> statusStats =
                statisticsService.getStatusStatistics(userId);

        return ResponseEntity.ok(statusStats);
    }
}