package com.example.goods_tracker.controller;

import com.example.goods_tracker.entity.Work;
import com.example.goods_tracker.repository.WorkRepository;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/work")
public class WorkController {

    private final WorkRepository repository;

    public WorkController(WorkRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/{id}/color")
    public Work setColor(@PathVariable Integer id, @RequestBody Work body) {
        Work work = repository.findById(id).orElseThrow();
        work.setColor(body.getColor());
        return repository.save(work);
    }
}