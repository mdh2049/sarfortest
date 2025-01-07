package dev.hyunlab.dummy.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.hyunlab.gravity.cmmn.domain.GcAtchmnflDto;
import dev.hyunlab.dummy.misc.Const;
import dev.hyunlab.dummy.misc.Utils;
import dev.hyunlab.dummy.service.AtchmnflService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AtchmnflServiceImpl implements AtchmnflService {
  @Value("${app.gravity.fs.url}")
  private String FS_URL;

  @Value("${app.gravity.fs.biz.key}")
  private String FS_BIZ_KEY;

  private String createUrl(String urlString, String atchmnflGroupId, String atchmnflId){
    return urlString.replaceAll("FS_URL", FS_URL.trim())
      .replaceAll("FS_BIZ_KEY", FS_BIZ_KEY.trim())
      .replaceAll("ATCHMNFL_GROUP_ID", atchmnflGroupId)
      .replaceAll("ATCHMNFL_ID", atchmnflId);

  }

  @Override
  @SuppressWarnings("unchecked")
  public List<Map<String, String>> processRegist(List<MultipartFile> mfiles, String atchmnflGroupId)
      throws IOException {
    MultipartEntityBuilder builder = MultipartEntityBuilder.create();

    mfiles.stream().forEach(mfile -> {
      try {
        builder.addBinaryBody("mfiles",
            mfile.getInputStream(),
            ContentType.getByMimeType(mfile.getContentType()),
            Utils.encodeBase64(mfile.getOriginalFilename())); // ! 한글 파일명 깨짐방지를 위해 base64 인코딩
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    });

    // 파일 업로드 + 데이터 저장
    String uri = createUrl("FS_URL/fs/FS_BIZ_KEY/process?atchmnflGroupId=ATCHMNFL_GROUP_ID", atchmnflGroupId, "");
    HttpPost post = new HttpPost(uri);
    post.setEntity(builder.build());

    List<Map<String, String>> list = new ArrayList<>();

    try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
      try (CloseableHttpResponse response = client.execute(post)) {
        String jsonString = EntityUtils.toString(response.getEntity());
        Map<String, Object> map = new ObjectMapper().readValue(jsonString, Map.class);
        list = (List<Map<String, String>>) map.get(Const.DATA);
      }
    }

    return list;

  }

  @Override
  @SuppressWarnings("unchecked")
  public List<GcAtchmnflDto> getsByAtchmnflGroupId(String atchmnflGroupId) throws IOException {
    String uri = createUrl("FS_URL/fs/FS_BIZ_KEY/parent/ATCHMNFL_GROUP_ID/children", atchmnflGroupId, "");
    HttpGet get = new HttpGet(uri);

    try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
      try (CloseableHttpResponse response = client.execute(get)) {
        String jsonString = EntityUtils.toString(response.getEntity());
        Map<String, Object> dataMap = new ObjectMapper().readValue(jsonString, Map.class);
        List<Map<String, Object>> list = (List<Map<String, Object>>) dataMap.get(Const.DATA);

        return list
            .stream()
            .map(m -> {
              GcAtchmnflDto dto = new GcAtchmnflDto();
              dto.setAtchmnflGroupId(m.get("atchmnflGroupId").toString());
              dto.setAtchmnflId(m.get("atchmnflId").toString());
              dto.setContentType(m.get("contentType").toString());
              dto.setFileSize(Long.parseLong(m.get("fileSize").toString()));
              dto.setOriginalFilename(m.get("originalFilename").toString());
              dto.setSaveFilename(m.get("saveFilename").toString());
              dto.setSaveSubPath(m.get("saveSubPath").toString());

              return dto;
            }).toList();
      }
    }

  }

  @Override
  public byte[] getBytesOfFile(String atchmnflId) throws IOException {
    String uri = createUrl("FS_URL/fs/FS_BIZ_KEY/ATCHMNFL_ID/file", "", atchmnflId);
    HttpGet get = new HttpGet(uri);

    try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
      try (CloseableHttpResponse response = client.execute(get)) {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        response.getEntity().writeTo(os);
        return os.toByteArray();
      }
    }
  }

  @Override
  @SuppressWarnings("unchecked")
  public Optional<GcAtchmnflDto> getById(String atchmnflId) throws ClientProtocolException, IOException {
    String uri = createUrl("FS_URL/fs/FS_BIZ_KEY/ATCHMNFL_ID", "", atchmnflId);
    HttpGet get = new HttpGet(uri);

    try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
      try (CloseableHttpResponse response = client.execute(get)) {
        String jsonString = EntityUtils.toString(response.getEntity());
        Map<String, Object> dataMap = new ObjectMapper().readValue(jsonString, Map.class);
        Map<String, Object> map = (Map<String, Object>) dataMap.get(Const.DATA);

        GcAtchmnflDto dto = new GcAtchmnflDto();
        dto.setAtchmnflGroupId(map.get("atchmnflGroupId").toString());
        dto.setAtchmnflId(map.get("atchmnflId").toString());
        dto.setContentType(map.get("contentType").toString());
        dto.setFileSize(Long.parseLong(map.get("fileSize").toString()));
        dto.setOriginalFilename(map.get("originalFilename").toString());
        dto.setSaveFilename(map.get("saveFilename").toString());
        dto.setSaveSubPath(map.get("saveSubPath").toString());

        return Optional.of(dto);
      }
    }

  }

  @Override
  public byte[] getBytesOfFirstFile(String atchmnflGroupId) throws IOException {
    String uri = createUrl("FS_URL/fs/FS_BIZ_KEY/parent/ATCHMNFL_GROUP_ID/children/first/file", atchmnflGroupId, "");
    HttpGet get = new HttpGet(uri);
    try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
      try (CloseableHttpResponse response = client.execute(get)) {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        response.getEntity().writeTo(os);
        return os.toByteArray();
      }
    }
  }

  @Override
  public void deletesByAtchmnflGroupId(String atchmnflGroupId) throws ClientProtocolException, IOException {
    if (atchmnflGroupId == null) {
      return;
    }

    try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

      String uri = createUrl("FS_URL/fs/FS_BIZ_KEY/parent/ATCHMNFL_GROUP_ID/children", atchmnflGroupId, "");
      HttpDelete delete = new HttpDelete(uri);
      try (CloseableHttpResponse response = client.execute(delete)) {
        log.debug("삭제결과: {} {}", atchmnflGroupId, EntityUtils.toString(response.getEntity()));
      }
    }
  }

}
