package dev.hyunlab.dummy.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import dev.hyunlab.gravity.cmmn.misc.GcResultMap;
import dev.hyunlab.gravity.cmmn.view.GcFileDownloadView;
import dev.hyunlab.dummy.service.AtchmnflService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/atchmnfls")
@RequiredArgsConstructor
public class AtchmnflRestController {
  private final AtchmnflService service;

  @PostMapping("/file")
  @Operation(summary = "파일 업로드")
  public ResponseEntity<GcResultMap> uploadFile(@RequestBody List<MultipartFile> mfiles,
      @RequestParam String atchmnflGroupId) throws IOException {
    List<Map<String, String>> list = service.processRegist(mfiles, atchmnflGroupId);

    return ResponseEntity.ok(GcResultMap.withData(list));
  }

  @GetMapping("/{atchmnflId}/file")
  @Operation(summary = "파일 다운로드")
  public ModelAndView downloadFile(@PathVariable String atchmnflId) throws IOException {
    ModelAndView mav = new ModelAndView(new GcFileDownloadView());

    mav.addObject(GcFileDownloadView.BYTES, service.getBytesOfFile(atchmnflId));
    mav.addObject(GcFileDownloadView.FILE_NAME, service.getById(atchmnflId).get().getOriginalFilename());

    return mav;
  }

  @GetMapping("/parent/{atchmnflGroupId}/children")
  @Operation(summary = "n개 첨부파일 목록 조회")
  public ResponseEntity<GcResultMap> getsByAtchmnflGroupId(@PathVariable String atchmnflGroupId) throws IOException {
    return ResponseEntity.ok(GcResultMap.withData(service.getsByAtchmnflGroupId(atchmnflGroupId)));
  }

  @GetMapping("/parent/{atchmnflGroupId}/children/first/file")
  @Operation(summary = "1개 파일 다운로드")
  public ModelAndView downloadFirstFile(@PathVariable String atchmnflGroupId) throws IOException {
    ModelAndView mav = new ModelAndView(new GcFileDownloadView());

    mav.addObject(GcFileDownloadView.BYTES, service.getBytesOfFirstFile(atchmnflGroupId));

    return mav;
  }
}
