package dev.hyunlab.dummy.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.http.client.ClientProtocolException;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import dev.hyunlab.gravity.cmmn.domain.GcAtchmnflDto;

public interface AtchmnflService {
  List<Map<String, String>> processRegist(List<MultipartFile> mfiles, String atchmnflGroupId) throws IOException;

  List<GcAtchmnflDto> getsByAtchmnflGroupId(String atchmnflGroupId)
      throws JsonMappingException, JsonProcessingException, ClientProtocolException, IOException;

  byte[] getBytesOfFile(String atchmnflId) throws IOException;

  Optional<GcAtchmnflDto> getById(String atchmnflId)
      throws JsonMappingException, JsonProcessingException, ClientProtocolException, IOException;

  byte[] getBytesOfFirstFile(String atchmnflGroupId) throws IOException;

  void deletesByAtchmnflGroupId(String atchmnflGroupId) throws ClientProtocolException, IOException;
}
