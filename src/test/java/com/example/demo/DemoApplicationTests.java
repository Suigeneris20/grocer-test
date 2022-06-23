package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class DemoApplicationTests {
	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void testAllItems() {
		ResponseEntity<List<MusicItem>> responseEntity = restTemplate.exchange(
				"/items",
				HttpMethod.GET,
				null,
				new ParameterizedTypeReference<List<MusicItem>>() {});

		List<MusicItem> responseBody = responseEntity.getBody();
		assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
		//assertEquals(2, responseBody.size());
	}
}
