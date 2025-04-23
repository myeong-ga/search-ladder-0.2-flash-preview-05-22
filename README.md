### Google Gemini 기반 검색 챗봇 개발 작업일지 (2024.04.18)

안녕하세요! 오늘은 Google Gemini API를 활용한 검색 기반 챗봇의 개발 과정에서 중요한 기술적 개선을 이루었습니다. 특히 실시간 스트리밍 구현 방식을 크게 개선하여 사용자 경험과 개발자 경험 모두를 향상시켰습니다.

## 주요 개선사항

### 1. 스트리밍 구현 방식 개선

기존에는 Web Streams API를 직접 다루는 저수준 접근 방식을 사용했습니다:

```javascript
result.textStream.pipeTo(
  new WritableStream({
    write(chunk) {
      // 텍스트 청크 처리
    },
    close() {
      // 메타데이터 처리 및 소스 추출
    }
  })
)
```

이를 AI SDK의 고수준 API를 활용한 방식으로 전환했습니다:

```javascript
// 텍스트 청크 처리
onChunk: ({ chunk }) => {
  if (chunk.type === "text-delta") {
    dataStream.writeData({ type: "text-delta", text: chunk.textDelta })
  }
},

// 메타데이터 처리
onFinish: ({ text, providerMetadata }) => {
  // 소스 추출 및 전송
  dataStream.writeData({ type: "sources", sources })
},

// 스트림 병합
result.mergeIntoDataStream(dataStream)
```

이 변경으로 코드가 더 선언적이고 의도가 명확해졌으며, 관심사 분리와 타입 안전성이 향상되었습니다.

### 2. 하이브리드 접근법 도입

텍스트 스트리밍과 소스 처리를 분리하는 하이브리드 접근법을 도입했습니다:

- 텍스트는 `onChunk`에서 실시간으로 스트리밍
- 소스는 `onFinish`에서 전체 응답 완료 후 처리


이 방식은 사용자에게 텍스트를 즉시 보여주면서도, 정확한 소스 정보를 제공하는 최적의 사용자 경험을 제공합니다.

### 3. 최신 Gemini 모델 적용

`gemini-2.0-flash-exp`에서 `gemini-2.5-flash-preview-04-17`로 모델을 업그레이드했습니다. 이를 통해:

- 더 정확하고 품질 높은 응답 생성
- 최대 토큰 수를 1024에서 10000으로 증가시켜 더 긴 응답 지원


### 4. 시스템 프롬프트 도입

시스템 프롬프트를 별도 파일로 분리하고, 현재 날짜와 시간을 포함하도록 구현했습니다:

```javascript
export const SYSTEM_PROMPT = `
You are a Google search-based chatbot. Always provide the most up-to-date information and cite sources.
Today is ${formatCurrentDateTime()}
`;
```

이를 통해 챗봇이 시간 인식을 갖추고, 일관된 응답 스타일을 유지할 수 있게 되었습니다.

### 5. 마크다운 렌더링 개선

어시스턴트 메시지에 마크다운 렌더링을 적용하여 가독성을 크게 향상시켰습니다:

- 코드 블록에 구문 강조 적용
- 테이블, 링크 등 다양한 마크다운 요소 지원
- GitHub Flavored Markdown(GFM) 지원


## 개발자 경험(DX) 개선

이번 변경으로 개발자 경험이 크게 향상되었습니다:

1. **코드 가독성**: 더 선언적이고 의도가 명확한 코드로 가독성 향상
2. **유지보수성**: 관심사 분리를 통해 코드 유지보수가 용이해짐
3. **타입 안전성**: AI SDK의 타입 시스템을 활용한 더 안전한 코드
4. **확장성**: 새로운 기능 추가가 더 쉬워짐


## 사용자 경험(UX) 개선

사용자 경험 측면에서도 여러 개선이 이루어졌습니다:

1. **더 빠른 응답**: 텍스트가 생성되는 즉시 사용자에게 표시
2. **정확한 소스 정보**: 완전한 메타데이터를 기반으로 한 신뢰할 수 있는 소스 제공
3. **가독성 향상**: 마크다운 렌더링을 통한 응답 가독성 개선
4. **시간 인식**: 현재 날짜와 시간을 인식하여 더 정확한 정보 제공


## 결론

오늘의 개선 작업을 통해 Google Gemini 기반 검색 챗봇의 품질이 크게 향상되었습니다. 특히 스트리밍 구현 방식의 개선은 코드 품질과 사용자 경험 모두에 긍정적인 영향을 미쳤습니다. AI SDK가 제공하는 고수준 API를 활용함으로써, 복잡한 스트리밍 로직보다 비즈니스 로직에 더 집중할 수 있게 되었습니다.

앞으로도 지속적인 개선을 통해 더 나은 챗봇 경험을 제공하겠습니다. 질문이나 피드백이 있으시면 언제든지 댓글로 남겨주세요!

#AI개발 #GoogleGemini #챗봇개발 #스트리밍API #개발일지