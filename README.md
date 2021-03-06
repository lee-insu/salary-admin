
[velog에서 읽기](https://velog.io/@lamda/%ED%97%A4%EC%9D%B4%EC%95%B1-%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EA%B8%B0) </br>


# 시작

UI디자이너와 협업을 통해 UXUI를 분석하는데 참고할만한 사이트가 부족해 디자이너에게 도움이 될 수 있는 UXUI 서비스를 만들기 위해 시작한 프로젝트입니다.


# 소개 
헤이앱은 한국의 모바일 디자인 패턴을 수집하고 분석하기 위한 방향성을 가지고 있습니다. 비슷한 해외 웹사이트는 많지만, 국내 앱의 스크린을 모아볼 수 있는 곳은 마땅치 않습니다. 많은 국내 디자이너들이 디자인 패턴과 UX를 탐구하고 참고할 수 있는 지식 플랫폼입니다.


## 1. 업로드와 뷰

관리자 페이지를 통해 게시글을 관리하고 업로드하면 뷰 페이지에서 보여지는 구성으로 작업을 했습니다. 이미지가 중심인 카테고리와 글이 중심인 카테고리로 나누어집니다. 이 둘은 등록된 키워드가 동일하면 유기적으로 글을 서로 볼 수 있도록 연동이 됩니다. 그래서 키워드를 중심으로 데이터가 담기고 같은 키워드면 출력이 되도록 데이터 베이스를 구성했습니다.


### 앱 콘텐츠 게시글의 업로드, 뷰

![](https://images.velog.io/images/lamda/post/e7d78d06-43f3-465a-9e8c-3886697dcbb2/image.png)

앱 콘텐츠 등록에서는 대표 키워드를 등록하고 콘텐츠를 등록, 삭제할 수 있는 기능을 담당하고 있습니다. 관리자 페이지에서 대표 키워드를 등록하면 키워드 이름으로 카테고리가 생성됩니다. 그리고 콘텐츠 등록을 누르면 이미지를 등록할 수 있는 모달창이 뜹니다.
![](https://images.velog.io/images/lamda/post/93559f2d-0bb6-4c1f-b047-174f07700ed6/image.png)

이미지 등록에서는 앱의 이름, 버전과 같은 특성과 카테고리로 분류된 키워드 중 어울리는 키워드를 클릭하면 해당 데이터베이스에 담깁니다. 집중탐구 키워드는 글이 중심인 콘텐츠와 연동시키기 위해 등록합니다. 아래의 이미지 등록에서 앱의 기능마다 분류하고 이미지를 등록할 수 있습니다.

firebase를 사용하면서 이미지를 업로드 했다는 미리보기와 db에 저장되는 부분을 분리하는 작업에 고민을 했습니다. 그리고 제가 생각한 방법은 둘 다 같은 사진이 저장되지만 미리보기는 이미지의 url를 만들어 내가 어떤 사진을 업로드 했는지 보여주고 그 url를 db에 또 담는 방식을 선택했습니다. 그렇게 미리보기와 db 동시에 업로드 되고 개별 이미지를 삭제할 수 있게 만들었습니다.
```
   const imgChange = e => {
        const {target:{name,value}} = e;
        if(name === 'subtext') {
            setSubText(value)
        }else if(name === 'img') {
            for(let i = 0; i <e.target.files.length; i++) {
                const newImgs = e.target.files[i];
                newImgs['id'] = Math.random();
                setImgs(prevState => [...prevState,newImgs]);
                try {
                   const createUrl = URL.createObjectURL(newImgs);
                   setPreview(prevState => prevState.concat(createUrl));
                   URL.revokeObjectURL(newImgs);

                }catch(err) {
                    console.log('image preview error',err)
                }
            }
        }else if(name === 'order') {
            setOrder(value)
        }

    }


    const imgSubmit = async(e) => {
        e.preventDefault();
            const promises = imgs.map(img => {
                const ref = storage.ref(`images/${titleKeyword}/${appName}/${appVer}/${img.name}`);
                return ref 
                .put(img)
                .then(()=>ref.getDownloadURL())
            });
           
            Promise.all(promises)
            .then((urls) => {
                imgStore.doc(`${titleKeyword}`).collection('img').doc(`${appName}${appVer}`).collection('list').add({
                    app_name:appName,
                    app_ver:appVer,
                    sub:subText,
                    imgs:urls,
                    order,
                })

                alert('suc!');
                setUrls(prevState => [prevState,...urls]);
                setImgs([]);
                setPreview([]);
                setOrder("");
                setSubText('');
            })
          .catch(err => console.log(err));

    }

```

![](https://images.velog.io/images/lamda/post/349d7ade-8383-4897-8774-0c0ac3c6f759/image.png)

뷰 페이지에선 전체 또는 키워드마다 분류가 되어 원하는 키워드 카테고리를 클릭하면 해당 데이터베이스에 담겨 있는 게시글을 보여줍니다.


### 집중탐구 콘텐츠의 등록


![](https://images.velog.io/images/lamda/post/e89176c0-2291-47af-a3d0-7f996ac7adb1/image.png)

집중탐구 콘텐츠는 글이 중심인 콘텐츠입니다. 앱 콘텐츠와 마찬가지로 연관된 키워드를 등록하고 삭제할 수 있으며 키워드 중심으로 분류되는 앱 콘텐츠와 다르게 집중탐구 콘텐츠는 업로드 날짜로 분류가 됩니다. 

![](https://images.velog.io/images/lamda/post/2a596dfb-b333-4ec7-b609-0680ef2c67ff/%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB-%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8-2021-11-23-%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE-4.18.54.gif)

콘텐츠 등록을 눌렀을 때 게시글의 제목, 소제목, 연간 키워드와 날짜, 대표 이미지, 그리고 아티클을 담을 수 있는 보드로 구성된 모달창이 뜹니다.


![](https://images.velog.io/images/lamda/post/c72992fd-5f81-4ab1-953d-64b5f6bea560/image.png)

업로드를 하게 되면 뷰 페이지에서 대표 이미지와 제목, 조회수 업로드 된 날짜, 그리고 등록한 키워드가 보여집니다.

### 게시글과 키워드 연동 




업로드된 콘텐츠를 클릭했을 때 보여지는 아티클입니다. 콘텐츠를 클릭하면 앱의 기능대로 분류가 되어 보여지고 맨 아래의 집중탐구에서는 앱 콘텐츠와 집중탐구 콘텐츠의 키워드가 일치했을 때 보여집니다. 

### 콘텐츠 관리 

![](https://images.velog.io/images/lamda/post/9c5a59ab-1f09-42a7-b922-bf310dc0737f/image.png)

![](https://images.velog.io/images/lamda/post/0883160a-5a16-4610-8b96-e9e84023ae1d/image.png)

콘텐츠 관리는 업로드된 콘텐츠를 뷰 페이지에서 보여줄지 숨길지를 구별하는 기능입니다. 토글 버튼으로 true와 fasle를 구분합니다.


### 검색

![](https://images.velog.io/images/lamda/post/e34dd9d0-1ff8-4345-8038-1a4ff34baf7d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-23%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.45.47.png)

![](https://images.velog.io/images/lamda/post/c1540bb0-7b15-43bd-9b83-70f366312d16/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-23%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%204.45.56.png)

검색기능은 키워드, 본문의 있는 글로 검색된 단어가 포함되면 앱 콘텐츠와 집중탐구 콘텐츠를 분류해서 검색 결과를 알려줍니다.

## 2.개발 과정

협업을 통해 이루어진 작업인 만큼 서로의 다른 시각으로 작업물이 이상한 방향으로 빠지는 것을 방지하기 위해 협업툴로 소통하고 차근차근 작업했습니다.

### 피그마로 협업하기 

![](https://images.velog.io/images/lamda/post/efd29f67-6c01-4aa2-8b16-6bff17568deb/image.png)

[피그마에서 구경하기](https://www.figma.com/file/sORmu6uHgQBQ3s3RTUHNCR/heyapp?node-id=0%3A1)



디자이너와 협업을 통해 가능한 기능과 불가능한 기능을 구분하고 유저 플로우, 디자인 가이드를 함께 이야기하며 서로 부족한 것을 보완하고 예상하지 못한 변수에 대응할 수 있었습니다.

### 데이터 베이스 구조

이번 작업은 많은 게시글이 생성되고 삭제되므로 데이터 베이스의 구조를 확실하게 구성하는 것이 중요하다고 판단했습니다. 키워드를 중심으로 찾고 문서를 생성, 삭제하는 것이 자연스럽고 불필요한 데이터가 업로드되는 것을 막기 위해 효율적인 구조로 구성하려고 노력했습니다.

### 우선순위 정하기
혼자서 하나의 작업물을 구현하는 것은 쉽지 않은 일이었습니다. 막대한 작업량을 계획 없이 작업하다가는 정리가 되지 않은 채로 미완성이 될 가능성이 컸습니다. 그래서 정해진 계획과 일정대로 작업을 하는 것이 중요했습니다. 먼저 해야 할 일을 우선순위와 작업의 흐름이 이어질 수 있도록 정했습니다.

<strong>유저 플로우와 디자인 구성, 그리고 논의 > 기술 스택과 사용할 API 정하기 > 필요한 기능 정리하기 >  데이터 베이스 구성 > 관리자 페이지 로직 작업 > 뷰 페이지 로직 작업</strong>

이 순서로 작업이 이어질 수 있도록 우선순위를 정했습니다.

### 문제를 해결하는 방법

작업을 하다 보면 매일 문제가 발생합니다. 예상했던 로직이 안 됐던 경우도 많았고 예상치 못한 변수도 많이 발생했습니다. 여러 번 시행착오 끝에 효율적으로 문제를 해결하는 방법을 찾았습니다. 검색을 통해 문제를 해결하려면 "이 기능을 구현하고 싶은데 이 코드에서 뭐가 문제지?" 가 아니라 내가 필요한 기능을 검색해서 찾아내는 방법이 더 빠르게 코드를 개선할 수 있었습니다. 예를 들면, 서로 다른 배열 값이 뿌려지고 이 배열을 하나로 통합해 나열하고 싶었습니다. 그랬을 때 js의 기능을 살펴보며 flat과 new Set를 활용해보자 생각했었고 검색을 통해 다른 개발자들이 어떻게 활용했는지 확인을 하고 내 코드에 적용해 문제를 해결한 예가 있습니다. 


## 3. 배운 점

검색도 똑똑하게 해야 똑똑한 답을 얻을 수 있다는 점
코드를 저지르고 완성 후에 개선하는 것이 아니라 틈이 있을 때마다 개선 해야 한다는 것(아니면 산더미처럼 쌓여서 하기가 힘들다)</br>
공식 문서로 기술의 컨셉을 이해하면 작업하는데 좀 더 수월하다는 점</br>
최적화는 생각보다 쉽지 않다는 점</br>
공통된 로직은 클래스로 묶으면 훨씬 편하다는 점</br>

## 4. 아쉬운 점

보수적으로 스택을 정한 점(next.js를 활용해서 작업하고 싶었는데 일정 안에 못 끝날 것 같아 작업하지 못함)</br>
기능은 구현이 되지만 좀 더 깨끗하고 튼튼한 코드를 짜고 싶었다는 점</br>
최적화에 대해 좀 더 고민했으면 하는 아쉬운 점</br>
데이터베이스를 좀 더 짜임새 있게 구성했으면 하는 아쉬운 점

## 5. 제작 과정

제작 기간: 2개월 (63일)</br>
스택,서비스 : React, JS, Firebase, Redux, PostCSS</br>
라이브러리: CKeditor</br>
협업툴: Figma


