# 생성 정보
- author : 어드민 (admin) 
- since : 2025-01-06T14:09:39.215779299

# 할일
- .vscode/launch.json : sar-e18ac518df06-admin 문자열을 settings.gradle파일이 위치한 폴더명으로 변경해야 함
- settings.gradle : sar-e18ac518df06-admin 문자열을 settings.gradle파일이 위치한 폴더명으로 변경해야 함
- resources/logback-spring.xml : 파일경로 수정해야 함
- resources/application-local.properties
    - server.servlet.context-path 값 수정해야 함. 기본값: /sar-api
    - server.port 값 수정해야 함. 기본값: 18080
    - app.gravity.fs.url 값 수정해야 함. 기본값: http://localhost:11492/gravity-fs  
    - app.gravity.fs.biz.key 값 수정해야 함. 기본값: SAR
- *.html
    - <base href=""/> 의 href값을 수정해야 함. 기본값: http://localhost:18080/sar-app/
- resources/public/js/const.js
    - API_URL값 수정해야 함. <base href="">과 값이 동일해야 함. 기본값: http://localhost:18080/sar-app/
    - BIGDATA_API_URL값 수정해야 함. 기본값: http://localhost:5173
# 빌드 방법

# 실행 방법