package dev.hyunlab.dummy.controller;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;
import java.io.IOException;


import org.apache.http.client.ClientProtocolException;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.hyunlab.gravity.cmmn.misc.GcResultMap;

import dev.hyunlab.dummy.domain.TbE18ac518df06Fbe62f2dd314Dto;
import dev.hyunlab.dummy.service.TbE18ac518df06Fbe62f2dd314Service;
import dev.hyunlab.dummy.service.AtchmnflService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/tb-e18ac518df06-fbe62f2dd314")
@RequiredArgsConstructor
@Slf4j
public class TbE18ac518df06Fbe62f2dd314Controller {
  private final AtchmnflService atchmnflService;
  private final TbE18ac518df06Fbe62f2dd314Service service;

  @PostMapping
  public ResponseEntity<GcResultMap> regist(@RequestBody TbE18ac518df06Fbe62f2dd314Dto dto) {
    return ResponseEntity.ok(GcResultMap.withData(service.regist(dto)));
  }

  @PutMapping("/{id}")
  public ResponseEntity<GcResultMap> update(@PathVariable String id, @RequestBody TbE18ac518df06Fbe62f2dd314Dto dto) {
    service.update(id, dto);

    return ResponseEntity.ok(GcResultMap.empty());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<GcResultMap> deleteById(@PathVariable String id) throws IllegalArgumentException, IllegalAccessException, ClientProtocolException, IOException {
    Optional<TbE18ac518df06Fbe62f2dd314Dto> opt = service.getById(id);
    if (opt.isEmpty()) {
      return ResponseEntity.ok(GcResultMap.empty());
    }

    //
    service.deleteById(id);

    // 첨부파일 삭제    
    TbE18ac518df06Fbe62f2dd314Dto dto = opt.get();
    Field[] fields = dto.getClass().getFields();
    for (Field f : fields) {
      f.setAccessible(true);
      Object obj = f.get(dto);
      // ! atchmnflGroupId는 fgrp로 시작함
      if (obj != null && obj.toString().startsWith("fgrp")) {
        atchmnflService.deletesByAtchmnflGroupId(obj.toString());
        break;
      }
    }

    return ResponseEntity.ok(GcResultMap.empty());

  }

  @GetMapping("/{id}")
  public ResponseEntity<GcResultMap> getById(@PathVariable String id) {
    Optional<TbE18ac518df06Fbe62f2dd314Dto> dto = service.getById(id);

    return ResponseEntity.ok(GcResultMap.withData(dto.orElse(null)));
  }

  @GetMapping
  public ResponseEntity<GcResultMap> gets(Pageable pageable) {
    List<TbE18ac518df06Fbe62f2dd314Dto> dtos = service.gets(pageable);

    return ResponseEntity.ok(GcResultMap.withData(dtos));
  }

  @GetMapping("/search")
  public ResponseEntity<GcResultMap> search(Pageable pageable) {
    GcResultMap resultMap = service.search(pageable);

    return ResponseEntity.ok(resultMap);
  }
} // class