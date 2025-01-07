package dev.hyunlab.dummy.service.impl;

import dev.hyunlab.gravity.cmmn.misc.GcBeanUtils;
import dev.hyunlab.gravity.cmmn.misc.GcResultMap;

import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;
import org.springframework.data.domain.Page;


import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import dev.hyunlab.dummy.entity.TbE18ac518df06Fbe62f2dd314;
import dev.hyunlab.dummy.domain.TbE18ac518df06Fbe62f2dd314Dto;
import dev.hyunlab.dummy.repository.TbE18ac518df06Fbe62f2dd314Repository;
import dev.hyunlab.dummy.service.TbE18ac518df06Fbe62f2dd314Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TbE18ac518df06Fbe62f2dd314ServiceImpl implements TbE18ac518df06Fbe62f2dd314Service {
  private final TbE18ac518df06Fbe62f2dd314Repository repository;

  private TbE18ac518df06Fbe62f2dd314Dto toDto(TbE18ac518df06Fbe62f2dd314 entity) {
    TbE18ac518df06Fbe62f2dd314Dto dto = GcBeanUtils.copyProperties(entity, TbE18ac518df06Fbe62f2dd314Dto.class);

    // TODO

    return dto;
  }

  @Override
  @Transactional
  public String regist(TbE18ac518df06Fbe62f2dd314Dto dto) {
    TbE18ac518df06Fbe62f2dd314 entity = GcBeanUtils.copyProperties(dto, TbE18ac518df06Fbe62f2dd314.class,
      Map.of("colMdfcnDt", LocalDateTime.now()),
      List.of());
    repository.save(entity);

    return entity.getPkFbe62f2dd314();
  }

  @Override
  @Transactional
  public void update(String id, TbE18ac518df06Fbe62f2dd314Dto dto) {
    repository
      .findById(id)
      .ifPresent(entity -> {
        dto.setPkFbe62f2dd314(id);
        TbE18ac518df06Fbe62f2dd314 newEntity = GcBeanUtils.copyProperties(dto, TbE18ac518df06Fbe62f2dd314.class, 
          Map.of("colMdfcnDt", LocalDateTime.now()), 
          List.of());
        repository.save(newEntity);
      });
  }

  @Override
  @Transactional
  public void deleteById(String id) {
    repository.deleteById(id);
  }

  @Override
  public Optional<TbE18ac518df06Fbe62f2dd314Dto> getById(String id) {
    return repository.findById(id).map(this::toDto);
  }

  @Override
  public List<TbE18ac518df06Fbe62f2dd314Dto> gets(Pageable pageable) {
    return repository.findAll(pageable).map(this::toDto).toList();
  }

  @Override
  public GcResultMap search(Pageable pageable){
    //
    Specification<TbE18ac518df06Fbe62f2dd314> specification = new Specification<TbE18ac518df06Fbe62f2dd314>() {
      List<Predicate> predicates = new ArrayList<>();

      @Override
      @Nullable
      public Predicate toPredicate(Root<TbE18ac518df06Fbe62f2dd314> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        // TODO 조회조건
        
        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
      }
    };

    //
    Page<TbE18ac518df06Fbe62f2dd314> page = repository.findAll(specification, pageable);

    List<TbE18ac518df06Fbe62f2dd314Dto> dtos = page
      .getContent()
      .stream()
      .map(this::toDto)
      .toList();

    return GcResultMap.of(dtos, pageable.getPageNumber(), pageable.getPageSize(), page.getTotalElements()); 
  }
} // class