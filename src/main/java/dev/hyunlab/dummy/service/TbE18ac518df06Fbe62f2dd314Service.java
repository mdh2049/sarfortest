package dev.hyunlab.dummy.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import dev.hyunlab.gravity.cmmn.misc.GcResultMap;

import dev.hyunlab.dummy.domain.TbE18ac518df06Fbe62f2dd314Dto;

public interface TbE18ac518df06Fbe62f2dd314Service {
  String regist(TbE18ac518df06Fbe62f2dd314Dto dto);

  void update(String id, TbE18ac518df06Fbe62f2dd314Dto dto);

  void deleteById(String id);

  Optional<TbE18ac518df06Fbe62f2dd314Dto> getById(String id);

  List<TbE18ac518df06Fbe62f2dd314Dto> gets(Pageable pageable);

  GcResultMap search(Pageable pageable);
} // class