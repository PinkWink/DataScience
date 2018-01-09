# 파이썬으로 데이터 주무르기

<img src="./img/title.jpg" width="300" height="300"></img>

* **파이썬으로 데이터 주무르기** 집필하고서 책 내용의 데이터와 소스코드를 최신으로 관리할 목적으로 유지하는 공간입니다.
* IT의 빠른 흐름 때문에 책 집필 후에 아래의 상황을 자주 만나게 됩니다.
	* 분석하려는 인터넷 사이트가 변경
	* 최신 버젼의 모듈이 문법이 변경
* 그래서 이 공간은 책이 다룬 데이터와 소스코드를 단순히 공개하는 것이 아니라 보다 적극적으로 독자를 위해 항상 소스코드가 공개되도록 유지하겠습니다.
	* 단, 분석하려는 해당 사이트가 아예 없어지거나
	* 해당 모듈이 더이상 버전업등의 지원이 없는 경우는 예외로 합니다.

## 관련 사이트
* 본 책에서 일부 중복되거나 혹은 시점의 차이는 있지만, 단편적 이야기들과 못다한 이야기들은 저자인 PinkWink의 블로그에서 볼 수 있습니다.
	* PinkWink의 블로그 : **[PinkWink의 블로그](http://pinkwink.kr/)**
* 본 책의 내용에서 더 자세하고 발전된 내용과 다양한 추가 예제는 **패스트캠퍼스**에서 강의로 진행되고 있습니다.
	* 패스트캠퍼스 강의 : **[파이썬을 활용한 데이터 분석 입문 CAMP](http://www.fastcampus.co.kr/data_camp_pda/)**

## 목차별 소스코드 학습시 주의 사항
* 집필 후 모듈의 업데이터 및 데이터의 취득 방법이나 그 내용이 변경된 경우에 대해서만 정리합니다.

### 1장 서울시 구별 CCTV 현황 분석
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/01.%20Basic%20of%20Python%2C%20Pandas%20and%20Matplotlib%20%20via%20analysis%20of%20CCTV%20in%20Seoul.ipynb)**
* 현재 발견된 수정사항 없음

### 2장 서울시 범죄 현황 분석
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/02.%20Analysis%20for%20crime%20in%20Seoul.ipynb)**
* 교재 대비 데이터나 환경이 변경된 사항
	* 교재에서 접근하는 방식으로 데이터를 얻으로 가면 교재 집필하던 때와 데이터의 형식이 변경되어 있습니다.
	* 지금은 데이터를 얻는 것이 실제 데이터라는 것에 대한 증명일 뿐이므로, 해당 데이터를 Github에서 배포하는 데이터를 다운받는 것으로 합니다.
* 교재 대비 코드가 변경된 사항
	* Matplotlib의 heatmap 등을 그릴때 cmap의 디폴트 설정이 변경되어 heatmap 등에서 cmap을 적용할 때 옵션을 잡아주어야 교재와 동일한 효과가 나타납니다. (소스코드에 모두 반영됨)
	* Folium이 0.4.0으로 판올림 되면서 choropleth 명령에서 geo_str 옵션명이 geo_data 옵션명으로 변경되었습니다.. (소스코드에 모두 반영)
	* Folium이 0.4.0으로 판올림 되면서 circle marker 적용할때, fill=True 옵션을 반듯이 사용해야 합니다. (소스코드에 모두 반영)

### 3장 시카고 샌드위치 맛집 분석
* 소스코드 : **[바로가기1](https://github.com/PinkWink/DataScience/blob/master/source_code/03-1.%20Web%20Parsing%20example.ipynb)**, **[바로가기2](https://github.com/PinkWink/DataScience/blob/master/source_code/03-2.%20Naver%20Movie%20Rank.ipynb)***
* 오타 수정
	* P125, 밑에서 두 번째 줄, 02. test_first.html --> **03. test_first.html**
* 교재 대비 코드가 변경된 사항
	* Folium이 0.4.0으로 판올림 되면서 choropleth 명령에서 geo_str 옵션명이 geo_data 옵션명으로 변경되었습니다.. (소스코드에 모두 반영)
	* Folium이 0.4.0으로 판올림 되면서 circle marker 적용할때, fill=True 옵션을 반듯이 사용해야 합니다. (소스코드에 모두 반영)

### 4장 셀프 주유소는 정말 저렴할까
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/04.%20Self%20Oil%20Station%20price.ipynb)**
* 오타 수정
	* P198, 대체로 '중구','중랑구'에 비싼 주유소가 몰려 있고, --> **대체로 '중구','종로구'에 비싼 주유소가 몰려 있고**
* 내용 수정
	* (소스코드에 언급했지만) 본 책에서 다루는 유가 정보 홈페이지는 접속한 사용자의 지역을 판단해서 첫 화면을 보여줍니다.
	* 그러므로 페이지 178의 그림 4-14 단계에서 지역에서 서울을 손으로 선택해 주어야 합니다.
	* 프로그램으로 접근해야하지만, 책 내용과 유사성을 맞추기 위해 손으로 선택해 주는 것으로 하겠습니다.
* 교재 대비 코드가 변경된 사항
	* Folium이 0.4.0으로 판올림 되면서 choropleth 명령에서 geo_str 옵션명이 geo_data 옵션명으로 변경되었습니다.. (소스코드에 모두 반영)
	* Folium이 0.4.0으로 판올림 되면서 circle marker 적용할때, fill=True 옵션을 반듯이 사용해야 합니다. (소스코드에 모두 반영)

### 5장 우리나라 인구 소멸 위기 지역 분석
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/05.%20population%20using%20Korea%20Map.ipynb)**
* 교재 대비 코드가 변경된 사항
	* Folium이 0.4.0으로 판올림 되면서 choropleth 명령에서 geo_str 옵션명이 geo_data 옵션명으로 변경되었습니다.. (소스코드에 모두 반영)

### 6장 19대 대선 결과 분석
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/06.%20Election%20Result.ipynb)**
* 내용수정
	* 6장은 아주 큰 변화가 있습니다. 바로 분석 대상이 되는 선거관리위원회 홈페이지가 변경된 것입니다.
	* 그래서 6장의 1절과 2절은 그 내용이 아주 많이 바뀌어야 합니다.
	* 그러나 6-3절 이후의 내용은 Github에서 배포하는 데이터를 이용해서 학습이 가능합니다.
	* 정상적으로 동작하는 코드는 다시 올려두었습니다. 세세한 내용은 해당 소스코드를 참조해 주세요.
	* **다시 이야기하지만 6-1절과 6-2절은 코드가 바뀌어서 Github에서 배포되는 소스코드를 확인해 주세요**
	* **데이터를 다운받아 사용하시면 6-3절 이후부터 학습가능합니다.**
* 교재 대비 코드가 변경된 사항
	* Folium이 0.4.0으로 판올림 되면서 choropleth 명령에서 geo_str 옵션명이 geo_data 옵션명으로 변경되었습니다.. (소스코드에 모두 반영)

### 7장 시계열 데이터를 다뤄보자
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/07.%20Time%20Series%20Data%20Handle.ipynb)**
* 내용수정
	* 7-3절에서 pandas에서 구글(google)에서 주식데이터를 가져오는데 최근 버전업 이후 이 명령이 동작하지 않습니다.
	* 그래서 yahoo에서 주식데이터를 가져오도록 수정되었습니다.
	* 일부 **daily_seasonality=True**와 같이 **Prophet** 명령을 사용할때 옵션이 교재와 달리 추가된 곳이 있습니다. 소스코드를 확인해 주세요.

### 8장 자연어 처리 시작하기
* 소스코드 : **[바로가기](https://github.com/PinkWink/DataScience/blob/master/source_code/08.%20Natural%20Language%20Processing.ipynb)**
* 모듈 설치
	* KoNLPy : **pip install konlpy**
	* JPype1 : **conda install -c conda-forge jpype1**
		* 이후 Jupyter Notebook 재실행 필요
	* JDK 설치 : Java JDK로 검색해서 OS에 맞춰 설치
   		* JAVA_HOME 설정 : 교재내용 참조 
   	* WordCloud 설치 : **conda install -c conda-forge wordcloud**
	* gensim install : **conda install -c anaconda gensim**
* 내용수정
	* P335에 있는 In125, In128 두 명령은 현 시점의 네이버 검색결과가 달라서 실행되지 않습니다.
	* 적절한 단어를 따로 찾아보셔도 좋습니다.
